#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════════
// DRYscope headless smoke test (v0.21)
//
// Builds a synthetic job that touches every room section and every
// fixture/appliance action, re-renders the estimate after EVERY edit,
// and asserts the Net Claim against an independently computed total
// (prices re-derived from MODEL by this script — not from the app's P).
//
// Run:   npm install jsdom   (once)
//        node dryscope_smoke_test.mjs ["DRYscope Estimator.html"]
// Exit code 0 = all green. Run it before every release.
// ════════════════════════════════════════════════════════════════════
import { JSDOM } from 'jsdom';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const here = path.dirname(url.fileURLToPath(import.meta.url));
const file = process.argv[2] || path.join(here, 'DRYscope Estimator.html');
const html = fs.readFileSync(file, 'utf8');

import { VirtualConsole } from 'jsdom';
const vc = new VirtualConsole();
vc.on('jsdomError', e => console.error('PAGE ERROR:', e.detail || e.message));
vc.on('error', (...a) => console.error('PAGE:', ...a));
vc.on('warn', (...a) => console.warn('PAGE:', ...a));
const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole: vc });
const win = dom.window, doc = win.document;
win.alert = () => {}; win.confirm = () => true;
await new Promise(res => { if (doc.readyState === 'complete') res(); else win.addEventListener('load', res); });
// top-level const/let in page scripts don't land on window — reach them via eval
const G = expr => win.eval(expr);

// ── independent pricer (same MODEL data, independent arithmetic) ──
const TAXR = 0.08;                       // Parker preset
const MF = 0.97;                         // market factor
const MODEL = G('MODEL');
const M = {}; MODEL.items.forEach(i => { M[i.id] = i; });
let tier = 'cat2';                       // mirrors the job's Cat radio
const r2 = x => Math.round(parseFloat((x * 100).toFixed(6))) / 100;

function resolve(id, opt) {
  const it = M[id]; if (!it) throw new Error('no MODEL item ' + id);
  let p = it.price;
  if (opt && it.pick) { const o = it.pick.options.find(o => o.id === opt); if (!o) throw new Error('no option ' + id + '/' + opt); if (o.price) p = o.price; }
  if (p && (p.cat1 || p.cat2 || p.cat3)) p = p[tier] || p.cat2;
  return p || { rem: 0, rep: 0, mat: 0 };
}
// form-driven line (app rounds derived P to cents)
const MP = (id, opt, scale = 1) => { const p = resolve(id, opt); return { rem: r2((p.rem||0)*MF*scale), rep: r2((p.rep||0)*MF*scale), mat: r2((p.mat||0)*MF*scale) }; };
// catalog-added line (modelLine does NOT round)
const RAW = (id, opt) => { const p = resolve(id, opt); return { rem: (p.rem||0)*MF, rep: (p.rep||0)*MF, mat: (p.mat||0)*MF }; };

const expLines = [];   // each: fn() -> {pre, tax}  (re-evaluated every step so tier changes flow through)
const L  = (qty, pf) => () => { const p = pf(); return { pre: qty*p.rem + qty*p.rep, tax: Math.round(qty*p.mat*TAXR*100)/100 }; };
const LM = (qty, id, opt, scale) => L(qty, () => MP(id, opt, scale));
const LR = (qty, id, opt) => L(qty, () => RAW(id, opt));
const LF = (qty, p) => L(qty, () => p);                          // fixed/local price
const BID = inv => LF(1, { rem: 0, rep: Math.round(inv*1.2*100)/100, mat: 0 });

// ── tiny DOM helpers ──
const $ = id => { const el = doc.getElementById(id); if (!el) throw new Error('missing #' + id); return el; };
const set = (id, v) => { $(id).value = String(v); };
const chk = (id, on = true) => { $(id).checked = on; };
const radio = (name, value) => {
  const els = doc.querySelectorAll('input[name="' + name + '"]');
  if (!els.length) throw new Error('no radio group ' + name);
  els.forEach(e => { e.checked = (e.value === value); });
};

let pass = 0, fail = 0;
function render() { win.renderEstimate(); }
function netClaim() {
  const el = doc.querySelector('.est-sum-row.final span:last-child');
  return parseFloat(el.textContent.replace(/[$,]/g, ''));
}
function expected() {
  let pre = 0, tax = 0;
  expLines.forEach(f => { const v = f(); pre += v.pre; tax += v.tax; });
  return Math.round((pre + tax) * 100) / 100;
}
function step(desc, apply, ...lines) {
  apply();
  lines.forEach(l => expLines.push(l));
  render();
  const got = netClaim(), want = expected();
  if (Math.abs(got - want) < 0.011) { pass++; console.log('  ✓ ' + desc + '  →  $' + got.toFixed(2)); }
  else { fail++; console.log('  ✗ ' + desc + '  got $' + got.toFixed(2) + '  expected $' + want.toFixed(2)); }
}
function check(desc, cond) {
  if (cond) { pass++; console.log('  ✓ ' + desc); }
  else { fail++; console.log('  ✗ ' + desc); }
}

console.log('DRYscope smoke test — app v' + G('APP_VERSION') + ' · model ' + MODEL.meta.version);

// ════════ MAIN / BASE CHARGES ════════
console.log('\nMain & base charges');
step('tax rate 8% (Parker)', () => set('tax_rate', 8));
step('emergency call — during hours', () => { radio('emg', 'yes'); radio('emg_hrs', 'during'); }, LM(1, 'emergency_call', 'during'));
step('emergency call — switch to after hours', () => { radio('emg_hrs', 'after'); expLines.pop(); }, LM(1, 'emergency_call', 'after'));
step('IEP pre-assessment bid $500', () => { chk('t_iep_pre'); $('t_iep_pre_inv').dataset.raw = '500'; }, BID(500));
step('asbestos in-house, 6 samples', () => { chk('t_asb_ih'); set('t_asb_ih_qty', 6); }, LF(1, { rem: 0, rep: r2(370 + 35*6), mat: 0 }));
step('plumber sub bid $425', () => { chk('sub_chk_plumber'); $('sub_inv_plumber').dataset.raw = '425'; }, BID(425));
step('floor cloth 20 LF @ 24"', () => set('m_cloth_lf', 20), LM(parseFloat((20*24/12).toFixed(1)), 'floor_protection', 'cloth24', 0.5));
step('floor adhesive film 10 LF @ 30"', () => { set('m_adh_lf', 10); radio('aw', '30'); }, LM(parseFloat((10*30/12).toFixed(1)), 'floor_protection', 'adhesive'));
step('PPE 2 / gloves 4 / resp cart 2 / resp full 1',
  () => { set('m_ppe', 2); set('m_gloves', 4); set('m_resp_c', 2); set('m_resp_f', 1); },
  LM(2, 'ppe'), LM(4, 'gloves'), LM(2, 'respirator_cartridge'), LM(1, 'respirator_full'));
step('containment 100 SF + zipper + posts 2×3', () => {
  set('m_cont_sf', 100); set('m_zip', 1);
  const r = doc.querySelector('#post-rows-m .dyn-row');
  r.querySelector('.dyn-qty').value = 2; r.querySelector('.dyn-days').value = 3;
}, LM(100, 'containment', '6mil'), LM(1, 'zipper'), LM(6, 'tension_post'));
step('monitoring 3 visits / 10 pieces + decon 10', () => { set('m_mon_visits', 3); set('m_mon_pieces', 10); set('m_decon', 10); },
  LM(parseFloat(((3*1.5)+(10*0.33)).toFixed(2)), 'monitoring'), LM(10, 'decon'));
step('haul debris 0.5 load', () => set('m_haul', 0.5), LM(0.5, 'haul'));
step('dumpster 12 yd — standard rate', () => set('m_dump', '12yd'), LF(1, { rem: 392.85, rep: 0, mat: 0 }));
step('main equipment: dehu 2×3, air movers 4×3, scrubber 1×3, filters', () => {
  chk('me_dehu_large_chk'); set('me_dehu_large_u', 2); set('me_dehu_large_d', 3);
  chk('me_air_mover_chk'); set('me_air_mover_u', 4); set('me_air_mover_d', 3);
  chk('me_scrubber_chk'); set('me_scrubber_u', 1); set('me_scrubber_d', 3);
  chk('me_hepa_neg_chk'); set('me_hepa_neg_u', 1);
  chk('me_carbon_16_chk'); set('me_carbon_16_u', 1);
}, LM(6, 'dehumidifier', 'std'), LM(12, 'air_mover', 'centrifugal'), LM(3, 'afd', 'std'), LM(1, 'afd_filter'), LM(1, 'carbon_filter', '16'));
step('main ducting 25 LF', () => set('m_ducting', 25), LM(25, 'ducting'));
step('labor: tech 2, super 1, TM 1.5, contents 2, B&P 3',
  () => { set('m_tech_labor', 2); set('m_super_labor', 1); set('m_tm', 1.5); set('m_contents', 2); set('m_bp', 3); },
  LM(2, 'tech_labor'), LM(1, 'supervisor'), LM(1.5, 'truck_mount'), LM(2, 'contents'), LM(3, 'block_pad'));
step('catalog item on Main: heat drying ×2', () => { win.addOtherItem('main', 'heat_drying'); G("otherSections['main']")[0].qty = 2; }, LR(2, 'heat_drying'));

// ════════ ROOM 1 — MASTER BATHROOM (every fixture action) ════════
console.log('\nRoom 1 — Master Bathroom');
set('room-drop', 'Master Bathroom'); win.confirmRoom();
check('room body built with new sections', !!doc.getElementById('r1_cont_sf') && !!doc.getElementById('r1_toilet'));

step('safety: containment 50, zipper 1, posts 2×2, registers 2', () => {
  set('r1_cont_sf', 50); set('r1_zip', 1); set('r1_reg', 2);
  const r = doc.querySelector('#r1_posts .dyn-row');
  r.querySelector('.dyn-qty').value = 2; r.querySelector('.dyn-days').value = 2;
}, LM(50, 'containment', '6mil'), LM(4, 'tension_post'), LM(1, 'zipper'), LM(2, 'register_mask'));

step('stabilization: extraction 80+40, muck-out 30, disinfect 120, B&P 2, contents 1.5', () => {
  set('r1_ext_carp', 80); set('r1_ext_hard', 40);
  radio('r1_muck', 'yes'); set('r1_muck_sf', 30);
  set('r1_ext_dis', 120); set('r1_blockpad', 2); set('r1_contents', 1.5);
}, LM(80, 'extraction', 'carpet'), LM(40, 'extraction', 'hard'), LM(30, 'muckout'),
   LM(120, 'antimicrobial'), LM(2, 'block_pad'), LM(1.5, 'contents'));

step('fixtures: toilet dispose+cap', () => { set('r1_toilet', 1); radio('r1_toilet_act', 'dispose'); },
  LM(1, 'toilet', 'dispose'), LM(1, 'supply_line', 'cap'));
step('fixtures: pedestal reinstall + cut&cap ×2', () => { set('r1_ped', 1); radio('r1_ped_act', 'reset'); set('r1_ped_sup', 'cutcap'); },
  LM(1, 'pedestal_sink', 'reinstall'), LM(2, 'supply_line', 'cutcap'));
step('fixtures: bathtub reinstall + caps ×2', () => { set('r1_tub', 1); radio('r1_tub_act', 'reset'); },
  LM(1, 'bathtub', 'reinstall'), LM(2, 'supply_line', 'cap'));
step('fixtures: shower door dispose', () => { set('r1_sh_door', 1); radio('r1_sh_door_act', 'dispose'); }, LM(1, 'shower_door', 'dispose'));
step('fixtures: vanity 4 LF remove-only', () => { set('r1_van', 4); radio('r1_van_act', 'only'); }, LM(4, 'vanity', 'dispose'));
step('fixtures: exhaust fan reinstall', () => { set('r1_exfan', 1); radio('r1_exfan_act', 'reset'); }, LM(1, 'light_fan', 'light_re'));
step('fixtures: P-trap disconnect-only', () => { set('r1_ptrap', 1); radio('r1_ptrap_act', 'only'); }, LM(1, 'p_trap', 'only'));
step('fixtures: tile countertop 12 SF + supply line remove ×2 + mirror 24–48"', () => {
  set('r1_ctr_tile', 12); set('r1_wdet', 2); set('r1_mir_t', 'md'); set('r1_mir_q', 1);
}, LM(12, 'countertop', 'tile_dp'), LM(2, 'supply_line', 'remove'), LM(1, 'mirror', 'fr_m'));

step('detach & salvage: window treatment, door, cans, fan, light, baseboard', () => {
  set('r1_wtreat', 1);
  set('r1_dslab', 1); radio('r1_dslab_act', 'detach');
  set('r1_rlight', 2); radio('r1_rlight_act', 'reset');
  set('r1_cfan', 1); radio('r1_cfan_act', 'dispose');
  set('r1_lfix', 1); radio('r1_lfix_act', 'detach');
  set('r1_bboard', 12); radio('r1_bboard_act', 'dispose');
}, LM(1, 'window_treatment'), LM(1, 'interior_door', 'remove_only'), LM(2, 'recessed_light', 'reinstall'),
   LM(1, 'light_fan', 'fan_dp'), LM(1, 'light_fan', 'light_only'), LM(12, 'baseboard', 'dispose'));

step('demo: carpet 100 + pad under, tile 50 + backer under, tackless 40', () => {
  set('r1_flA_t', 'carpet'); win.flUnder(1, 'A'); set('r1_flA_sf', 100); set('r1_flA_u', 'pad');
  set('r1_flB_t', 'tile');   win.flUnder(1, 'B'); set('r1_flB_sf', 50);  set('r1_flB_u', 'backer');
  set('r1_fl_tack', 40);
}, LM(100, 'flooring', 'carpet'), LM(100, 'flooring', 'pad'),
   LM(50, 'flooring', 'tile'), LM(50, 'flooring', 'backer'), LM(40, 'tackless'));
step('demo: drywall 2\' cut 24 LF + full 80 SF, wall tile 30, insulation 60, drill 8', () => {
  set('r1_dwA_t', 'cut2'); set('r1_dwA_q', 24);
  set('r1_dwB_t', 'full'); set('r1_dwB_q', 80);
  set('r1_wall_tile', 30); set('r1_wall_insul', 60); set('r1_drill', 8);
}, LM(24, 'drywall', 'cut2'), LM(80, 'drywall', 'full'), LM(30, 'wall_tile'), LM(60, 'insulation'), LM(8, 'cavity_holes'));
step('demo: ceiling 40 + suspended 20, shower tile 60, bench 10', () => {
  set('r1_ceil_dw', 40); set('r1_ceil_tile', 20); set('r1_sh_tile', 60); set('r1_bench', 10);
}, LM(40, 'ceiling', 'drywall'), LM(20, 'ceiling', 'suspended'), LM(60, 'shower_surround'), LM(10, 'shower_bench'));

step('cleaning: full HEPA sandwich + stud/joist + mold stain 50', () => {
  set('r1_cl_w', 104); set('r1_cl_f', 150); set('r1_cl_c', 40); set('r1_cl_stud', 20); set('r1_cl_joist', 10);
  chk('r1_mold_stain_chk'); set('r1_mold_stain', 50);
}, LM(324, 'hepa_light'), LM(104, 'surface_clean', 'walls'), LM(150, 'surface_clean', 'floor'),
   LM(40, 'surface_clean', 'ceiling'), LM(20, 'surface_clean', 'walls'), LM(10, 'surface_clean', 'ceiling'),
   LM(220, 'antimicrobial'), LM(30, 'hepa_detailed'), LM(50, 'mold_stain'));

step('switch job to Cat 3 — category-priced lines reprice', () => { radio('cat', '3'); tier = 'cat3'; });
step('switch back to Cat 2', () => { radio('cat', '2'); tier = 'cat2'; });

step('equipment in room: dehu 1×4, air movers 3×4, cavity drying 1×2, ducting 20', () => {
  chk('re_1_dehu_large_chk'); set('re_1_dehu_large_u', 1); set('re_1_dehu_large_d', 4);
  chk('re_1_air_mover_chk'); set('re_1_air_mover_u', 3); set('re_1_air_mover_d', 4);
  chk('re_1_wall_cavity_chk'); set('re_1_wall_cavity_u', 1); set('re_1_wall_cavity_d', 2);
  set('r1_duct', 20);
}, LM(4, 'dehumidifier', 'std'), LM(12, 'air_mover', 'centrifugal'), LM(2, 'cavity_drying'), LM(20, 'ducting'));

step('catalog item in room: hydroxyl ×3', () => { win.addOtherItem('r1', 'hydroxyl'); G("otherSections['r1']")[0].qty = 3; }, LR(3, 'hydroxyl'));

// ════════ ROOM 2 — CRAWL SPACE ════════
console.log('\nRoom 2 — Crawl Space');
set('room-drop', 'Crawl Space'); win.confirmRoom();
step('crawl: vapor 200, insulation out 100, board in 50', () => {
  set('r2_vapor_sf', 200); set('r2_insul_rem', 100); set('r2_insul_inst', 50);
}, LF(200, { rem: 0, rep: 0.19, mat: 0 }), LF(100, { rem: 0.51, rep: 0, mat: 0 }), LF(50, { rem: 0, rep: 2.46, mat: 2.13 }));

// ════════ ROOM 3 — KITCHEN (appliances) ════════
console.log('\nRoom 3 — Kitchen');
set('room-drop', 'Kitchen'); win.confirmRoom();
check('Kitchen has an Appliances section', doc.querySelector('#rbody_3') && doc.querySelector('#rbody_3').innerHTML.indexOf('Appliances') >= 0);
step('appliances: disposal only, dishwasher reinstall+cap, fridge only+cap', () => {
  set('r3_gdisp', 1); radio('r3_gdisp_act', 'only');
  set('r3_dw', 1); radio('r3_dw_act', 'reset');
  set('r3_frid', 1); radio('r3_frid_act', 'only');
}, LM(1, 'garbage_disposal', 'dispose'),
   LM(1, 'dishwasher', 'reinstall'), LM(1, 'supply_line', 'cap'),
   LM(1, 'refrigerator', 'dispose'), LM(1, 'supply_line', 'cap'));
step('appliances: gas range only, electric range reinstall, hood reinstall', () => {
  set('r3_rg', 1); radio('r3_rg_act', 'only');
  set('r3_re', 1); radio('r3_re_act', 'reset');
  set('r3_rhood', 1); radio('r3_rhood_act', 'reset');
}, LM(1, 'range', 'gas_dp'), LM(1, 'range', 'elec_re'), LM(1, 'range_hood', 'reinstall'));
step('fixtures: sink reinstall+caps×2, cabinets 6 LF re / 4 LF only, counters', () => {
  set('r3_sink', 1); radio('r3_sink_act', 'reset');
  set('r3_cabl', 6); radio('r3_cabl_act', 'reset');
  set('r3_cabu', 4); radio('r3_cabu_act', 'only');
  set('r3_ctr_sol', 6); radio('r3_ctr_sol_act', 'only');
  set('r3_ctr_lam', 3); radio('r3_ctr_lam_act', 'reset');
}, LM(1, 'sink', 'reinstall'), LM(2, 'supply_line', 'cap'),
   LM(6, 'cabinets', 'lo_re'), LM(4, 'cabinets', 'up_dp'),
   LM(6, 'countertop', 'solid_dp'), LM(3, 'countertop', 'lam_re'));

// ════════ ROOM 4 — LAUNDRY (washer/dryer + flagged disconnects) ════════
console.log('\nRoom 4 — Laundry Room');
set('room-drop', 'Laundry Room'); win.confirmRoom();
step('washer reinstall + caps ×2, dryer only', () => {
  set('r4_wash', 1); radio('r4_wash_act', 'reset');
  set('r4_dryr', 1); radio('r4_dryr_act', 'only');
}, LM(1, 'laundry', 'wash_re'), LM(2, 'supply_line', 'cap'), LM(1, 'laundry', 'dry_dp'));
step('water-heater & furnace disconnect flags ($0 documentation lines)', () => {
  chk('r4_wh_chk'); chk('r4_furn_chk');
}, LF(1, { rem: 0, rep: 0, mat: 0 }), LF(1, { rem: 0, rep: 0, mat: 0 }));

// ════════ STRUCTURE ASSERTIONS ════════
console.log('\nEstimate structure');
const est = doc.getElementById('est-content').innerHTML;
const order = ['***Safety***', '***Stabilization***', '***Fixtures***', '***Detach &amp; Salvage***', '***Demolition***', '***Cleaning***', '***Equipment***', '***Additional Items***'];
let idx = est.indexOf('Master Bathroom'), ok = true, last = idx;
for (const h of order) { const i = est.indexOf(h, idx); if (i < 0 || i < last) { ok = false; break; } last = i; }
check('Room 1 sections render in SECTIONS order', ok);
check('Bathroom has no Appliances subsection', est.indexOf('***Appliances***', est.indexOf('Master Bathroom')) === -1 || est.indexOf('***Appliances***', est.indexOf('Master Bathroom')) > est.indexOf('Kitchen'));
check('Kitchen renders Appliances before Fixtures', est.indexOf('***Appliances***', est.indexOf('Kitchen')) < est.indexOf('***Fixtures***', est.indexOf('Kitchen')));
check('flagged water-heater line present', est.indexOf('WATER HEATER disconnect') >= 0);
check('estimate uses 6 columns / no RESET column', est.indexOf('RESET') === -1);

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
