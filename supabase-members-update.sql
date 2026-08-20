-- Rotary Club Pashupati Kathmandu — full member roster update
-- Source: rotary_pashupati_members_full.csv (63 people)
-- Run this whole file in the Supabase SQL Editor.
--
-- What it does:
--   1. Creates public.member_contacts (private contact details, admin-only via RLS).
--   2. Upserts all 63 people into public.members by name (existing rows keep their
--      photo_url, donation_amount and is_trf — only role/type/bio/order/active change).
--   3. Deactivates any existing board/member row NOT in this roster (rotaract untouched).
--   4. Fills member_contacts with phone/email/birthday/spouse data.

-- ── 1. Private contact table ────────────────────────────────────────────────
create table if not exists public.member_contacts (
  member_id   uuid primary key references public.members(id) on delete cascade,
  rotary_id   text,
  spouse      text,
  birthday    text,   -- kept as text: source mixes Gregorian and Bikram Sambat
  anniversary text,
  phone       text,
  mobile      text,
  email       text,
  updated_at  timestamptz default now()
);

alter table public.member_contacts enable row level security;

-- Admin-only. No public/anon policy => anonymous visitors cannot read this table.
drop policy if exists "admin_all_member_contacts" on public.member_contacts;
create policy "admin_all_member_contacts" on public.member_contacts
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ── 2. Roster ───────────────────────────────────────────────────────────────
drop table if exists public._roster;
create table public._roster (
  name text, role text, mtype text, bio text, order_index int,
  rotary_id text, spouse text, birthday text, anniversary text,
  phone text, mobile text, email text
);

-- Staging table holds contact data; lock it down in case the script aborts midway.
alter table public._roster enable row level security;

insert into public._roster values
-- Board: officers + chairs (16) --------------------------------------------
('Rtn. Tej Prasad Timsina','President','board','Education',1,'10908611','Gita','22 July','6 Jestha',null,'9841264350','tej_prasad@hotmail.com'),
('Rtn. Dipendra Bansdkota','President Elect','board','Education',2,'10642646','Binu','19 January','17 Baishakh',null,'9851197327','souldpb@gmail.com'),
('Rtn. Ganesh Bahadur Thapa','Charter President','board','Banking Consultancy',3,'3349778','Sabitri','Jul 7','Apr 17','4473868 (O), 4473868 (R)',null,'gbthapa@wlink.com.np'),
('Rtn. Dr Pravesh Dahal','President Nominee','board','Doctor',4,'11210423','Ekta','6 Poush','1 May',null,'9812113206','dhl.pravesh@yahoo.com'),
('Rtn. Bindu Prakash Joshi','Vice President','board','Engineer (M)',5,'9600730','Bhama','19 Jan','6 Marga','0-4622785','9851098796','binprajos@hotmail.com'),
('Rtn. Manoj Paudel','Vice President','board','Medical Marketing',6,'10406678','Archana','18 May','7 Dec',null,'9851233273','rtnmanoj27@gmail.com'),
('Rtn. Ramu Pandeya','Secretary','board','Education',7,'12214799','Radhika Gaire','Mangsir 10','Magh 23',null,'9851070954','ramupandeya2000@gmail.com'),
('Rtn. Nisha Acharya','Joint Secretary','board','Courier Export',8,'11737537','Badri','23 February','28 Asar',null,'9845025581','trackoncouriers15@gmail.com'),
('Rtn. Moti Ram Phuyal','Treasurer','board','Education',9,'10908625','Sangita','23 Falgun','27 Magh',null,'9841235004','motiphuyal@gmail.com'),
('Rtn. Gopal Prasad Pokherel','Secretary at Army','board','Education',10,'5978850','Sumitra','May 28','28 Mangsir','4474387 (O), 4821518 (R)','9851074775','gppokhrel12@gmail.com'),
('Rtn. Dr Archana KC','TRF Chair','board','Doctor (Surgeon)',11,'12300493','Dr Binod Dangal','May 11','Magh 11',null,'9841544615','kcarchana0511@gmail.com'),
('Rtn. Ganesh Subedi','IPP / Service Project Chair','board','Business',12,'10094170','Bandana','1 March','11 Asar','015573768','9851041575','deltaimporter12@gmail.com'),
('Rtn. Hark Saud','Club Admin Chair','board','Food & Beverage',13,'9322724','Bindra','16 Nov','28 June','01-4262102','9849775804','hbsaud14@gmail.com'),
('Rtn. Surya Bahadur Adhikari','Public Image Chair','board','Education',14,'9600732','Chandra','3 Oct','19 Baishakh',null,'9851059219','surya59219@gmail.com'),
('Rtn. Mamata Raj Singh','Public Image Chair','board','Administration',15,'11789085','Rajan','7 March','13 Falgun',null,'9841278126','mamtaforus@gmail.com'),
('Rtn. Parkash Sapkota','Co-Chair','board','Service',16,'11789199','Nabina','8 Baishakh','21 Baishakh',null,'9841427922','p.sapkota2011@gmail.com'),
-- Past Presidents (9) -------------------------------------------------------
('Rtn. Min Bahadur Raut','Past President','member','Electric Consultancy',20,'3349942','Shova','April 29','May 14','4421992 (O), 4413339 (R)','9851020540','min.raut@gmail.com'),
('Rtn. Devi Ram Sharma','Past President','member','Ex. Govt. Service',21,'6961187','Karuna','Sept 21','Sept 21',null,'9801085360','devid744@hotmail.com'),
('Rtn. Jessica Chemjong','Past President','member','Education',22,'5782751','Rudra','April 10','February 29','4275993 (O), 4881004 (R)','01-5375993, 5467337','rtnjessica27@gmail.com'),
('Rtn. Sapan Kumar Dev','Past President','member','Travel Trade',23,'6190109','Sirjana','January 4','Baishakh 20','4218601 (O), 4430234 (R)','9851021167','sapandev@yahoo.com'),
('Rtn. Bhuvaneshwari Rao','Past President','member','Education',24,'8098718','B.S. Shiv Rao','October 2','June 14','4280814','9851105564, 9851108651','bhuvna12@hotmail.com'),
('Rtn. Binod Kumar Karki','Past President','member','Banker',25,'8038014','Rajani','Kartik 24','Mangsir 17','014009665','9851042947','bkarkipbank@gmail.com'),
('Rtn. Gopal Prasad Dangal','Past President','member','Business',26,'8609992','Sita','9 Mangsir','18 Asar','015210154','9851096226','dangalgopal1974@gmail.com'),
('Rtn. Rajendra Rijal','Past President','member','Fruit Process',27,'3349785','Prabha','Jul 5','Jan 23','4471866 (R)','9851098929','rijalrajendra@hotmail.com'),
('Rtn. Devendra Rijal','Past President','member','Metal Craft',28,'3350010','Mamata','November 26','June 13','4470960 (O), 4466999 (R)','9851062826','devprijal@gmail.com'),
-- Advisors, mentors, facilitators, youth contacts (10) ----------------------
('Rtn. Sashi Raj Pandey','Club Advisor','member','Private Finance',30,'3350066','Urmila','July 16','February 16','4422038 (O), 4418989 (R)','9851020453, 9851104403','sashipandey@gmail.com'),
('Rtn. Chuman Jung Shahi','Club Advisor','member','Construction',31,'8098725','Bina','28 June','28 Falgun','014439229','9851065229','shahichumbanjung@gmail.com'),
('Rtn. Durga Prasad Subedi','Club Advisor','member','Courier & Cargo',32,'7008724','Lata','Baishakh 31','Falgun 29','4811323 (R), 4212122 (O)','9851011720','dipesh@awecourier.com'),
('Rtn. Haribhakta Budhathoki','Club Mentor','member','Writer',33,'5782750','Mina','July 8','June 10','4526008 (R)','9841274535','mail.haribhakta@gmail.com'),
('Rtn. Shalik Ram Adhikari','Club Mentor','member','Stock Broker',34,'8530082','Sita','20 Mangsir','1 Falgun','014810695','9851069257','shalik.adhikari2012@gmail.com'),
('Rtn. Rajesh Neupane','Club Mentor','member','Ex. Govt. Service',35,'8214328','Deepa','Ashadh 20','Ashadh 20','4109698','9851115433','rajesh.neupane@gmail.com'),
('Rtn. Himal Sigdel','Club Learning Facilitator','member','Statistician',36,'5301205','Sonu','17 Oct','7 March',null,'9846024430','himalaya.sigdel@gmail.com'),
('Rtn. Milan Kumar K.C.','Club Learning Facilitator','member','Civil Engineer',37,'10298995','Sanjana','8 Oct','6 Feb',null,'9841634579','rtn.milan@gmail.com'),
('Rtn. Bhuvan Singh Kunwar','Young Leader Contact','member','Contractor',38,'9222679','Gargi','24 Aug','20 Jan',null,'9851157230','4process2@gmail.com'),
('Rtn. Shristi Raut','Young Leader Contact','member','Law Student',39,'10994233',null,'14 February',null,null,'9843987940','rautsristy22@gmail.com'),
-- Members (28) --------------------------------------------------------------
('Rtn. Surya Lal Prajapati','Member','member','Social Worker',50,'6092957','Krishna Maya','Asar 26','Baishakh 14','4423565 (O), 4412519 (R)','9851085016',null),
('Rtn. Khem Raj Pant','Member','member','Courier',51,'8119900','Nirmala','21 June','1 Jestha','4285179 (R), 4780533 (O)','9851021876','khem@info.com.np'),
('Rtn. Anil Kumar Kejriwal','Member','member','Banker',52,'8530089','Rita','July 1','December 11','4441702 (O), 4477511 (R)','9851072013','anilkerjiwal1@gmail.com'),
('Rtn. Dr. Sangeeta Baral Basnet','Member','member','Doctor',53,'11210429','Dr. Narayan','24 Aug','19 Nov',null,'9851122090','sangsbbasnet812@gmail.com'),
('Rtn. Bandana Khanal','Member','member','Nursing',54,'10966814','Ganesh','17 July','11 Asar',null,'9841623828','bandana.khanal12@gmail.com'),
('Rtn. Urmila Pandey','Member','member','Social Work',55,'11210412','Sashi','9 April','16 Feb',null,'9851107118','urupandey@gmail.com'),
('Rtn. Dr. Binod Dangal','Member','member','Doctor',56,'11210419','Dr. Archana','13 Sep','11 Magh',null,'9841715973','binod.dangal999@gmail.com'),
('Rtn. Suswopna Rimal','Member','member','Social Work',57,'12300491','Adarsha Pandey','December 29','November 29',null,'9802309325','suswopna.rimal@gmail.com'),
('Rtn. Ashish Poudyal','Member','member','Medical Marketing',58,null,'Samikshya Shrestha','November 15','February 7',null,'9843588253','ashish.sam143@gmail.com'),
('Rtn. Mina Budhathoki','Member','member','Social Work',59,'10827423','Haribhakta','30 August','June 10','4426008 (R)','9861798182',null),
('Rtn. Purna Bahadur Rai','Member','member','Travel Trade',60,'11553763','Menuka','November 21','March 10','4106559 (O), 4476146 (R)','9851020787','rajmd@rajgroup.com.np'),
('Rtn. Dhurba Prasad Ghimire','Member','member','Social Worker',61,'9322677','Uma','20 Magh','17 Baishakh','014810098','9851059709','president@pariwartankhabar.com'),
('Rtn. Bharat Karki','Member','member','Development Service',62,'9629658','Yushmita','31 Shrawan','26 Baishakh',null,'9858020509','bk2005ad@yahoo.com'),
('Rtn. Sajal Maskey','Member','member','Hydropower',63,'9326313','Arun','20 Feb','20 June',null,'9841509412','sajal.maskey@gmail.com'),
('Rtn. Yogendra Ojha','Member','member','Service',64,'10298988','Sushila','20 June','05 June',null,'9841019679','ysojha@yahoo.com'),
('Rtn. Deepa Neupane','Member','member','Social Worker',65,'10827422','Rajesh','15 Nov','Ashadh 20','4109698','9851113937','rajdeep.neupane@gmail.com'),
('Rtn. Kedar Neupane','Member','member','Former UN Official',66,'10940408','Arline Perz','29 March (Ramnawami 2006)','31 January',null,'+41 76 783 3577','Neupanek1950@gmail.com'),
('Rtn. Kim J. Baaden','Member','member','Corporate Trainer',67,'6007108',null,'10 May',null,null,'9851087234','kim@impactyes.com'),
('Rtn. Bhupendra Ghimire','Member','member','Social Work',68,'10298957','Nirmala','4 Jul','1 Feb',null,'9851070477','vinnepal@gmail.com'),
('Rtn. Chiranjeebi Bhattarai','Member','member','Business',69,'10815947','Pooja','6 April','19 Magh',null,'9851196571','bhattarai.chiranjeebi@gmail.com'),
('Rtn. Giri Raj Khatrai','Member','member','Development Professional',70,'9627379','Kamala','9 March','25 Sept',null,'9841869144','giri.envfrnd@gmail.com'),
('Rtn. Sangita Karki Kunwor','Member','member','Business',71,'10768248','Devendra','22 June','22 May',null,'01091 42 1886','kunwor25@gmail.com'),
('Rtn. Anit Thapaliya','Member','member','Consultant',72,'10763517',null,'13 April','22 May',null,'821 09734 1304','anitdgred@outlook.com'),
('Rtn. Umesh Sitaula','Member','member','Student',73,'10764012',null,'4 Jul','1 Feb',null,'9818283941','Rcpashupati27@gmail.com'),
('Rtn. Narayan Bhakta Shrestha','School Principal','member','Education',74,null,'Rajan Devi','17 August 1973','1 January','014800049, 014800589/497','9841201916','narayan.stha123@gmail.com'),
('Rtn. Ramesh Nepal','Member','member','Business',75,null,'Pujan Khatiwada','1 January','1 Falgun','014010095','9851042828','nep-ramesh10@yahoo.com'),
('Rtn. Chhiring Sherpa','Member','member','Business',76,null,'Ngilamu Sherpa','2037-06-21 (BS)','21 Ashad',null,'9845385457','chhiring207@gmail.com'),
('Rtn. Jenny Bhattarai','Member','member','Public Health',77,null,null,'Baishakh 4',null,null,null,'rtrjenny@gmail.com');

-- ── 3. Sync public.members ──────────────────────────────────────────────────
-- Retire anyone no longer on the roster (rotaract rows are left alone).
update public.members m
   set active = false, updated_at = now()
 where m.type in ('board', 'member')
   and not exists (
     select 1 from public._roster r where lower(trim(r.name)) = lower(trim(m.name))
   );

-- Update the ones we already have (keeps photo_url / is_trf / donation_amount).
update public.members m
   set role        = r.role,
       type        = r.mtype,
       bio         = r.bio,
       order_index = r.order_index,
       active      = true,
       updated_at  = now()
  from public._roster r
 where lower(trim(r.name)) = lower(trim(m.name));

-- Insert the new ones.
insert into public.members (name, role, type, bio, order_index, active)
select r.name, r.role, r.mtype, r.bio, r.order_index, true
  from public._roster r
 where not exists (
   select 1 from public.members m where lower(trim(m.name)) = lower(trim(r.name))
 );

-- ── 4. Contact details ──────────────────────────────────────────────────────
insert into public.member_contacts
  (member_id, rotary_id, spouse, birthday, anniversary, phone, mobile, email)
select m.id, r.rotary_id, r.spouse, r.birthday, r.anniversary, r.phone, r.mobile, r.email
  from public._roster r
  join public.members m on lower(trim(m.name)) = lower(trim(r.name))
on conflict (member_id) do update
  set rotary_id   = excluded.rotary_id,
      spouse      = excluded.spouse,
      birthday    = excluded.birthday,
      anniversary = excluded.anniversary,
      phone       = excluded.phone,
      mobile      = excluded.mobile,
      email       = excluded.email,
      updated_at  = now();

-- ── 5. Clean up the staging table ──────────────────────────────────────────
drop table public._roster;

-- Sanity check — expect 16 board, 47 member, 63 contact rows.
select type, count(*) from public.members where active and type in ('board','member') group by type;
select count(*) as contacts from public.member_contacts;
