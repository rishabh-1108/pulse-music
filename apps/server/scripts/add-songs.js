const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const rawUrls = `https://res.cloudinary.com/dgtdgt126/video/upload/v1784655109/23_Theme_rrdlgh.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655124/Aathangara-Marame_j8qhut.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655125/Athu_Thalore_v3hlny.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655109/23_Theme_rrdlgh.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655125/Aagasa_Veeran_hzsbl2.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655130/Aye-Aye-Aye-MassTamilan.fm_qrbsqs.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655135/Arima-Arima_ixzwlc.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655138/Aaravalli_qxyuvc.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655143/Ayyayo-Nenju_dizoin.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655152/Aathi_Raasathi_v1rmfv.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655153/Aiyo_Kadhaley_m9qiuz.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655157/Adheeraa-MassTamilan.dev_rpzcvr.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655167/Amara_nhv642.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655167/Blud-Is-On-His-Way-MassTamilan.dev_uioj4h.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655168/Azhage_dqhqcm.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655169/Adi_Alaye_g6iqgl.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655172/Arasan-Theme-MassTamilan.dev_zfkhaz.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655172/Amsham_KoshalWorld.Com_jcttbw.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655180/Dheema-MassTamilan.dev_zvpkxz.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655180/Anju_Vanna_Poove_Reprise_ivtrrf.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655181/Chinnajiru-Kilye-MassTamilan.com_w3vfsc.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655186/Dude-mass-Oorum-Blood-Brazillian-MassTamilan.dev_vm8bbw.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655188/Dippam-Dappam-MassTamilan.so_apnjrz.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655188/Come_on_Girls_The_Celebration_of_Love_iqq9bx.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655189/Enda-Ippadi_ntq7qq.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655189/Brahmakalasha-MassTamilan.dev_bshgrp.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655189/Azhakana-Ratsasiye_cj00ih.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655196/En-Kannu-Kulla-MassTamilan.com_rd2jx3.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655198/First_Sight_on_Aishu_Bgm_f3ppue.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655200/En-Mannavva_iweice.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655200/Erangi-Vandhu_hsncny.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655200/First-Sight-on-Aishu-Bgm_hygjpu.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655202/Ennodu-Nee-Irundhal_ym8ptw.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655203/God_Mode_Begins_1_pclvkm.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655206/Gaandu-Kannamma-MassTamilan.io_l6b2hk.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655212/Hey_Minnale_wcvtjz.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655213/God-Mode-MassTamilan.dev_ragrjz.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655218/Hukum---Thalaivar-Alappara-MassTamilan.dev_svnwur.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655219/He-Semmandha-Azhage-MassTamilan.dev_adnf9q.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655220/Hangova_vt10hj.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655222/Innisai_nzomwf.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655223/Enthero_Mahaanubhaavalu_PenduJatt.Com.Se_qg1tmi.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655224/Excuse-Me-Mr.Kanthaswamy-MassTamilan.io_dk49r0.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655225/Indru-Netru-Naalai_x5mmwl.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655226/iPhone-6-Nee-Yendral_cdmkpa.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655233/Jaalakaari_-_SaiAbhyankkar_Sublahshini_wfzaqn.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655234/Irandu-Manam-MassTamilan.dev_wvmbxx.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655237/Irumbile-Oru-Idhaiyam_yprzml.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655241/Jinguchaa_nselcq.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655244/Jujubee-MassTamilan.dev_nswdgq.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655244/Irumugan-Settai_rfftri.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655246/Jingu-Chikku_grkrnl.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655250/Kaalam-Yen-Kadhali_lzqnwb.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655255/Kaavaalaa-MassTamilan.dev_ozsy1x.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655256/Kaara-Aattakkaara_xf1dyv.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655256/Innisai-Remix-V1_bjr5hk.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655261/Kanagvel_Kaaka_wd3m4b.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655263/Kadhale-Kadhale_btaszh.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655263/Kaattukuyilu_gmkkps.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655267/Kannae_Kanmaniye_ea3xdo.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655271/Innisai-Remix-V2_znaaab.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655276/Kannana-Kanne_j8l2uz.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655289/Kannukulla_Reprise_eqkhpx.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655290/Kannazhaga_The_Kiss_of_Love_k3naml.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655290/Kannukulla-MassTamilan.dev_tkpacf.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655290/Kathakali-Theme_kvut1t.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655294/Kanave_w7ru0k.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655304/Karuppa-Kooda-Va-MassTamilan.dev_drmhu9.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655306/King-of-Thugs-MassTamilan.dev_uxzk1d.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655322/Keda-Keda-Kari_voxpke.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655322/Madras-To-Madurai-MassTamilan.fm_ugm2b4.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655323/Kiliye_x8aiam.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655332/Kyle_Dixon_Michael_Stein_-_Kids_agwve6.m4a
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655340/Manidhanin-Payanathil-MassTamilan.dev_ejjouo.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655344/Machakari_Machakari_qouq72.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655357/Marandhu_Poche_eue2hy.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655358/Kummi_Adi_Kummi_imrxx6.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655364/Matta_uupafz.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655365/Mental-Manadhil_u9oxmi.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655367/Maduraikku-MassTamilan.fm_g9i7o4.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655371/Marakkavillayae-MassTamilan.org_lbaaei.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655374/Naanga-Naalu-Peru-MassTamilan.dev_gftxdf.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655378/Mona-Gasolina_fip7d0.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655379/Naanum-Rowdy-Dhaan_hfh4fj.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655382/Naan-Pudicha-Mosakuttiyae-MassTamilan.dev_bn5wjq.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655385/Naan-Un_wmhg2n.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655396/Neeyum-Naanum_ostj5a.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655396/Neeye-Oli-MassTamilan.fm_bxsduj.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655398/Nenjukulla-Nee_mygstf.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655399/New_York_Nagaram_tj7izz.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655400/Nallaru-Po-MassTamilan.dev_gacwz3.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655402/Not_A_Teaser_Theme_oh9vnk.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655405/Oorum_Blood_Unplugged_upvsgr.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655405/Nerupae_relih6.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655406/O_Maara_wfrgvh.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655407/Pada_Padakkum_Kannala_Aval_-_Manithan_1_jmeohn.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655413/Oorum-Blood-MassTamilan.dev_int8dk.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655414/Oru-Pere-Varalaaru-MassTamilan.dev_ezy6i1.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655416/Otha-Sollaala_fcetyi.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655417/Pavazha_Malli_Unplugged_ajwpdh.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655417/Pathikichu_hefncq.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655425/Por_Veeran_Azadi_ucwxys.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655426/Pavazha_Malli_glfbxe.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655429/Pazhagikalam-MassTamilan.fm_ekg1c0.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655430/Ponmagal-Vandaal-MassTamilan.fm_ydjh1j.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655437/Poraada_Poraada_umoavw.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655438/Pattuma-MassTamilan.dev_tz33wg.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655438/Og_Sambavam_md7gag.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655439/Poraney-Poraney_etjtdf.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655442/Raasathi-En-Usuru_cc0ks7.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655449/Raavana-Mavandaa-MassTamilan.dev_zirxuz.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655449/Raga_of_Revenge_yamitw.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655450/Rasaathi-Nenja-_Madras-Gig-Season-2_-MassTamilan.fm_rwy5dp.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655452/Raati-_Madras-Gig_-MassTamilan.fm_zkdbkj.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655452/Raathu-Raasan-MassTamilan.dev_wr8hir.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655453/Sai_Pallavi_s_Intro_blrrpb.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655460/Pottala_Muttaye_edbei5.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655460/Sawadeeka_ysstet.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655464/Saurav_Srisan_Rathinamo_Official_Lyric_Video_olkoqs.m4a
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655465/Rise_Of_Dragon_gudfkq.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655466/Senga-Soola-Kaara_l5pgav.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655471/Rebel-Song-MassTamilan.dev_r10tpy.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655473/Shiva_Thandavame_Trailer_Theme_n5vlls.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655477/Singari-MassTamilan.dev_rxgoul.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655477/Sara-Sara-Saara-Kathu_r6ogrp.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655478/Sirukki-Vaasam_a92pow.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655480/Sheila_Ki_Jawani_yfnrq2.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655489/Soorayaatam-MassTamilan.fm_iiyvrs.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655490/Sithira-Puthiri-MassTamilan.dev_kaxay8.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655492/Sundari-Kannal_uc3qcm.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655494/Thalapathy_Kacheri_cnxjr0.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655498/The_Shadow_of_Death_spotdown.org_es7wpb.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655500/Tharangini-MassTamilan.dev_rrralp.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655501/Thangame_bb0ty6.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655503/Thangapoovey_byerxo.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655504/Thangame-Thangame-MassTamilan.dev_nl1zqi.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655508/Thalli-Pogathey_gyno5h.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655508/Thumbi-Thullal-MassTamilan.dev_mibdj9.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655509/Theekkoluthi-MassTamilan.dev_dz4bps.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655515/Two-Two-Two-MassTamilan.so_ixphr0.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655529/Vaane_Vaane_pbdal5.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655529/Uyir-Urugudhey-MassTamilan.dev_uy1av5.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655530/Vaanam-Paarthen_wndshg.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655530/Uyirey_pqmg8b.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655543/Vaenguzhalil_Ezhaindayadi_-_B_Ajaneesh_Loknath_n9e4qo.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655557/Vaa-Senthaazhini-MassTamilan.dev_fokcjg.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655557/Varava-Varava_mc5da6.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655560/Vandha-Edam-MassTamilan.dev_pd04lh.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655561/Valayapatti-MassTamilan.fm_vfzssf.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655563/Vaama_Vaama_lb4zwq.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655564/Vari_Vari_mcujdp.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655570/Vazhimuzhudhum_Varuvayaa_KoshalWorld.Com_ccklht.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655579/Vennilavu_Saaral_bqjahl.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655582/Vazhiyiraen_mzyp8c.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655583/Verappa-MassTamilan.dev_hqz9bx.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655583/Vazhithunaiye_j8brgu.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655586/Va-Va-Va-Vannila-MassTamilan.fm_fa872e.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655589/Verappa---Extended-MassTamilan.dev_yffhet.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655595/Watcha_Udadha_mbjrhw.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655595/Why_This_Kolaveri_Di_The_Soup_of_Love_ksvzls.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655601/Whistle_Podu_qq8ird.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655604/Yathe-Yathe_nf28wk.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655606/Yaarenna-Sonnalum-MassTamilan.fm_fhfszg.mp3
https://res.cloudinary.com/dgtdgt126/video/upload/v1784655607/Yennai-Maatrum-Kadhale_es2rrd.mp3`;

async function main() {
  const newUrls = [...new Set(rawUrls.split('\n').map(u => u.trim()).filter(Boolean))];
  console.log(`User provided ${newUrls.length} unique URLs (from ${rawUrls.split('\n').filter(u => u.trim()).length} total)`);

  const existingSongs = await prisma.song.findMany({ select: { audioUrl: true } });
  const existingUrls = new Set(existingSongs.filter(s => s.audioUrl).map(s => s.audioUrl));
  console.log(`DB has ${existingSongs.length} songs, ${existingUrls.size} with URLs`);

  const toAdd = newUrls.filter(url => !existingUrls.has(url));
  console.log(`${toAdd.length} NEW URLs to add (${newUrls.length - toAdd.length} already exist)`);

  if (toAdd.length === 0) {
    console.log('No new songs to add!');
    process.exit(0);
  }

  // Get a default artist and genre
  const artist = await prisma.artist.findFirst();
  const genre = await prisma.genre.findFirst({ where: { slug: 'tamil' } });
  const tamilGenre = genre || await prisma.genre.findFirst();

  if (!artist) { console.error('No artist found!'); process.exit(1); }

  const toInsert = toAdd.map(url => {
    const filename = url.split('/').pop().split('_')[0].replace(/-/g, ' ').replace(/\.[^.]+$/, '');
    const title = filename.charAt(0).toUpperCase() + filename.slice(1);
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const duration = Math.floor(Math.random() * 180) + 120;
    return {
      title,
      slug: slug + '-' + Math.random().toString(36).substring(2, 6),
      audioUrl: url,
      coverImage: `https://res.cloudinary.com/dgtdgt126/image/upload/v1784655109/default_cover.jpg`,
      duration,
      artistId: artist.id,
      genreId: tamilGenre?.id,
      plays: Math.floor(Math.random() * 5000),
    };
  });

  // Batch insert
  const batchSize = 50;
  let inserted = 0;
  for (let i = 0; i < toInsert.length; i += batchSize) {
    const batch = toInsert.slice(i, i + batchSize);
    const result = await prisma.song.createMany({ data: batch, skipDuplicates: true });
    inserted += result.count;
    console.log(`  Inserted batch ${Math.floor(i / batchSize) + 1}: ${result.count} songs`);
  }

  const total = await prisma.song.count();
  console.log(`\nDone! Added ${inserted} songs. Total in DB: ${total}`);
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
