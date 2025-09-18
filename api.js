import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

let supabase;
export function initClient(){
  const SUPABASE_URL = '<YOUR_SUPABASE_URL>';
  const SUPABASE_ANON_KEY = '<YOUR_SUPABASE_ANON_KEY>';
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
export function client(){ return supabase; }

export async function getSession(){
  const { data: { user } } = await supabase.auth.getUser();
  let role = 'visitor';
  if(user){
    const { data } = await supabase.from('profiles').select('role, display_name, avatar_url').eq('id', user.id).single();
    role = data?.role || 'user';
    return { user, role, profile: data };
  }
  return { user:null, role };
}
export function onAuthStateChange(cb){ supabase.auth.onAuthStateChange(cb); }

// DOGS
export async function getDogs({ q='', city='', sex='', status='approved' }={}){
  let query = supabase.from('dogs').select('*').order('created_at',{ascending:false});
  if(status) query = query.eq('status', status);
  if(city) query = query.ilike('city', `%${city}%`);
  if(sex) query = query.eq('sex', sex);
  if(q) query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
  const { data, error } = await query;
  if(error) throw error; return data;
}
export async function getDogById(id){
  const { data, error } = await supabase.from('dogs').select('*').eq('id', id).single();
  if(error) throw error; return data;
}
export async function createDog(payload){ return supabase.from('dogs').insert(payload).select().single(); }
export async function updateDog(id, payload){ return supabase.from('dogs').update(payload).eq('id', id).select().single(); }
export async function submitForReview(id){ return supabase.from('dogs').update({ status:'pending' }).eq('id', id); }

// AUTH
export async function login(email, password){ return supabase.auth.signInWithPassword({ email, password }); }
export async function register(email, password, display_name){
  const { data, error } = await supabase.auth.signUp({ email, password });
  if(error) throw error;
  if(data?.user){
    await supabase.from('profiles').insert({ id: data.user.id, email, display_name, role:'user' });
  }
  return data;
}
export async function logout(){ return supabase.auth.signOut(); }

// ADMIN
export async function adminListPending(){
  const { data, error } = await supabase.from('dogs').select('*').eq('status','pending').order('created_at',{ascending:true});
  if(error) throw error; return data;
}
export async function adminApprove(id){
  const { data: { user } } = await supabase.auth.getUser();
  await supabase.from('dogs').update({ status:'approved' }).eq('id', id);
  await supabase.from('moderation_logs').insert({ entity_type:'dog', entity_id:id, action:'approve', admin_id:user?.id });
}
export async function adminReject(id, reason=''){
  const { data: { user } } = await supabase.auth.getUser();
  await supabase.from('dogs').update({ status:'rejected' }).eq('id', id);
  await supabase.from('moderation_logs').insert({ entity_type:'dog', entity_id:id, action:'reject', reason, admin_id:user?.id });
}
