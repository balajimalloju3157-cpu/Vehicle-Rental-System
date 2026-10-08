import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL     = 'https://kiizvbwpqsaxxvodqmcc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_VPHww9SLnqX0NXvyYLva7A_gmGjb-pY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const TEST_ID  = `TEST-${Date.now()}`;

const G = '\x1b[32m', R = '\x1b[31m', Y = '\x1b[33m', C = '\x1b[36m', B = '\x1b[1m', X = '\x1b[0m';
const pass = (m) => console.log(`${G}✔ PASS${X} — ${m}`);
const fail = (m) => console.log(`${R}✘ FAIL${X} — ${m}`);
const info = (m) => console.log(`${C}ℹ${X}  ${m}`);
const head = (m) => console.log(`\n${B}${Y}${m}${X}`);

async function run() {
  console.log(`\n${B}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${X}`);
  console.log(`${B}  SUPABASE CONNECTION TEST — NEW PROJECT${X}`);
  console.log(`${B}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${X}`);
  info(`URL: ${SUPABASE_URL}`);
  info(`ID:  ${TEST_ID}`);

  let ok = true;

  // TEST 1: Connection
  head('TEST 1 — Connection');
  try {
    const { error } = await supabase.from('rentals').select('id').limit(1);
    if (error) {
      fail(`Connection error: ${error.message}`);
      if (error.code === '42P01') console.log(`${R}  ⚠ Table "rentals" missing — run the SQL script first!${X}`);
      ok = false;
    } else pass('Connected to new Supabase project ✓');
  } catch (e) { fail(e.message); ok = false; }

  // TEST 2: INSERT
  head('TEST 2 — INSERT');
  try {
    const { data, error } = await supabase.from('rentals').insert([{
      id: TEST_ID,
      customerName: 'Connection Test',
      customerEmail: 'test@drivepulse.dev',
      customerPhone: '+91 00000 00000',
      licenseId: 'TEST-LICENSE',
      vehicleId: 'v1',
      vehicleName: 'Mahindra Thar 4x4',
      vehicleType: 'SUV',
      ratePerDay: 3200,
      durationDays: 1,
      city: 'Mumbai',
      pickupDate: '2026-10-10',
      returnDate: '2026-10-11',
      addons: ['Full Insurance Coverage'],
      addonsCost: 300,
      discountAmount: 0,
      totalAmount: 3920,
      status: 'Confirmed',
      bookingDate: new Date().toISOString().replace('T',' ').substring(0,16),
    }]).select();
    if (error) { fail(`INSERT: ${error.message}`); ok = false; }
    else pass(`Booking inserted — ID: ${data[0]?.id}, Total: ₹${data[0]?.totalAmount}`);
  } catch (e) { fail(e.message); ok = false; }

  // TEST 3: SELECT
  head('TEST 3 — SELECT by ID');
  try {
    const { data, error } = await supabase.from('rentals').select('*').eq('id', TEST_ID).single();
    if (error) { fail(`SELECT: ${error.message}`); ok = false; }
    else {
      pass(`Retrieved — ${data.vehicleName}, ${data.city}`);
      info(`  Pickup: ${data.pickupDate} → Return: ${data.returnDate}, Status: ${data.status}`);
    }
  } catch (e) { fail(e.message); ok = false; }

  // TEST 4: SELECT ALL
  head('TEST 4 — SELECT ALL');
  try {
    const { data, error } = await supabase.from('rentals').select('*').order('created_at', { ascending: false });
    if (error) { fail(`SELECT ALL: ${error.message}`); ok = false; }
    else pass(`Fetched ${data.length} record(s) from Supabase`);
  } catch (e) { fail(e.message); ok = false; }

  // TEST 5: UPDATE
  head('TEST 5 — UPDATE status');
  try {
    const { error } = await supabase.from('rentals').update({ status: 'Cancelled' }).eq('id', TEST_ID);
    if (error) { fail(`UPDATE: ${error.message}`); ok = false; }
    else pass(`Status → Cancelled for ${TEST_ID}`);
  } catch (e) { fail(e.message); ok = false; }

  // TEST 6: DELETE (cleanup)
  head('TEST 6 — DELETE (cleanup)');
  try {
    const { error } = await supabase.from('rentals').delete().eq('id', TEST_ID);
    if (error) { fail(`DELETE: ${error.message}`); ok = false; }
    else pass(`Test record deleted — ${TEST_ID}`);
  } catch (e) { fail(e.message); ok = false; }

  console.log(`\n${B}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${X}`);
  console.log(ok
    ? `${G}${B}  ✔ ALL TESTS PASSED — Supabase fully connected!${X}`
    : `${R}${B}  ✘ SOME TESTS FAILED — Check above errors.${X}`);
  if (!ok) console.log(`${Y}  Hint: Run the SQL setup script in Supabase SQL Editor first.${X}`);
  console.log(`${B}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${X}\n`);
}

run();
