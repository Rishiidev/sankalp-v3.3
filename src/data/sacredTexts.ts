export type TextType = 'doha' | 'chaupai' | 'shloka';

export interface Verse {
  type: TextType;
  num?: number;
  text: string;
  sanskrit?: string;
  meaning?: string;
}

export interface SacredTextContent {
  title: string;
  subtitle: string;
  themeColor: string;
  youtubeId?: string;
  verses: Verse[];
}

export const hanumanChalisa: SacredTextContent = {
  title: "Shri Hanuman Chalisa",
  subtitle: "Awaken devotion and inner strength",
  themeColor: "orange",
  youtubeId: "AETFvQonfV8",
  verses: [
    { type: 'doha', text: "Shri Guru Charan Saroj Raj, Nij Manu Mukuru Sudhari.\nBarnau Raghubar Bimal Jasu, Jo Dayaku Phal Chari.\nBudhi Heen Tanu Janike, Sumirau Pavan Kumar.\nBal Budhi Vidya Dehu Mohi, Harahu Kalesh Bikaar." },
    { type: 'chaupai', num: 1, text: "Jai Hanuman gyan gun sagar.\nJai Kapis tihun lok ujagar." },
    { type: 'chaupai', num: 2, text: "Ram doot atulit bal dhama.\nAnjani putra Pavan sut nama." },
    { type: 'chaupai', num: 3, text: "Mahavir vikram Bajrangi.\nKumati nivar sumati Ke sangi." },
    { type: 'chaupai', num: 4, text: "Kanchan varan viraj subesa.\nKanan kundal kunchit kesa." },
    { type: 'chaupai', num: 5, text: "Hath vajra aur dhuvaje viraje.\nKandhe moonj janehu saaje." },
    { type: 'chaupai', num: 6, text: "Sankar suvan Kesari nandan.\nTej prataap maha jag vandan." },
    { type: 'chaupai', num: 7, text: "Vidyavaan guni ati chatur.\nRam kaaj karibe ko aatur." },
    { type: 'doha', text: "Pavantanaya Sankat Harana, Mangala Murati Roop.\nRam Lakhan Sita Sahita, Hriday Basahu Sur Bhoop." }
  ]
};

export const shivaTandavaStotram: SacredTextContent = {
  title: "Shiva Tandava Stotram",
  subtitle: "The dance of cosmic energy and stillness",
  themeColor: "sky",
  youtubeId: "SjHOHEb8Lts",
  verses: [
    { type: 'shloka', num: 1, text: "Jatatavee galajjala pravaha pavitasthale\nGale avalambya lambitam bhujanga tungamalikam\nDamad damad damad dama ninadavadamarvayam\nChakara chandatandavam tanotu nah shivah shivam",
      sanskrit: "जटाटवीगलज्जलप्रवाहपावितस्थले\nगलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम्।\nडमड्डमड्डमड्डमन्निनादवड्डमर्वयं\nचकार चण्डताण्डवं तनोतु नः शिवः शिवम्।।1।।",
      meaning: "From the forest of His matted locks, water flows and wets His neck, on which hangs the greatest of snake-garlands, and His damaru drum beats ‘damat, damat, damat, damat’—may Lord Shiva, who performs the fierce Tandava dance, grant us prosperity."
    },
    { type: 'shloka', num: 2, text: "Jatakata hasambhrama bhramanilimpanirjhari\nVilolavichivalari virajamanamurdhani\nDhagaddhagaddhagajjvalala lalata pattapavake\nKishorachandra shekhare ratih pratikshanam mama",
      sanskrit: "जटाकटाहसम्भ्रमभ्रमन्निलिम्पनिर्झरी\nविलोलवीचिवल्लरीविराजमानमूर्धनि ।\nधगद्धगद्धगज्ज्वलल्ललाटपट्टपावके\nकिशोरचन्द्रशेखरे रतिः प्रतिक्षणं मम ॥२॥",
      meaning: "May my mind seek joy in Lord Shiva, in whose matted hair the celestial river Ganga roams, whose forehead burns with the blazing fire of knowledge (dhagat, dhagat), and who wears the crescent moon."
    },
    { type: 'shloka', num: 3, text: "Dharadharendranandini vilasabandhubandhura\nSphuraddigantasantati pramodamanamanase\nKrupakatakshadhorani nirudhadurdharapadi\nKvachiddigambare mano vinodametu vastuni",
      sanskrit: "धराधरेन्द्रनन्दिनीविलासबन्धुबन्धुर\nस्फुरद्दिगन्तसन्ततिप्रमोदमानमानसे ।\nकृपाकटाक्षधोरणीनिरुद्धदुर्धरापदि\nक्वचिद्दिगम्बरे मनो विनोदमेतु वस्तुनि ॥३॥",
      meaning: "May my mind seek happiness in Lord Shiva, in whose mind all the living beings of the glorious universe exist, who is the companion of Parvati (daughter of the mountain king), who controls unsurpassed adversity with His compassionate glance, and who wears the directions as His clothes (Digambara)."
    },
    { type: 'shloka', num: 4, text: "Jata bhujanga pingala sphurat phanamani prabha\nKadamba kunkumadrava pralipta digvadhumukhe\nMadandha sindhura sphurat tvaguttariyamedure\nMano vinodamadbhutam bibhartu bhutabhartari",
      sanskrit: "जटाभुजङ्गपिङ्गलस्फुरत्फणामणिप्रभा\nकदम्बकुङ्कुमद्रवप्रलिप्तदिग्वधूमुखे ।\nमदान्धसिन्धुरस्फुरत्त्वगुत्तरीयमेदुरे\nमनो विनोदद्भुतं बिभर्तु भूतभर्तरि ॥४॥",
      meaning: "May I find wonderful joy in Lord Shiva, the supporter of all life, whose creeping snake's hood shines with reddish gems, spreading colors like kadamba flowers and saffron paste on the faces of the goddesses of direction; and who wears a beautiful shimmering upper garment made from the skin of a huge intoxicated elephant."
    },
    { type: 'shloka', num: 5, text: "Sahasra lochana prabhritya shesha lekha shekhara\nPrasuna dhulidhorani vidhusaranghripithabhuh\nBhujangaraja malaya nibaddha jatajutaka\nShriyai chiraya jayatam chakora bandhushekharah",
      sanskrit: "सहस्रलोचनप्रभृत्यशेषलेखशेखर\nप्रसूनधूलिधोरणी विधूसराङ्घ्रिपीठभूः ।\nभुजङ्गराजमालया निबद्धजाटजूटक\nश्रियै चिराय जायतां चकोरबन्धुशेखरः ॥५॥",
      meaning: "May Lord Shiva, whose footstool is grayed by the dust of flowers falling from the heads of all gods led by Indra (the thousand-eyed one), whose matted hair is bound by the king of snakes, and whose crest holds the moon (the friend of Chakora birds), bless me with prosperity for a long time."
    },
    { type: 'shloka', num: 6, text: "Lalata chatvarajvalad dhananjayasphulingabha\nNipitapancha sayakam namannilimpanayakam\nSudha mayukha lekhaya virajamana shekharam\nMaha kapali sampade shirojatalamastu nah",
      sanskrit: "ललाटचत्वरज्वलद्धनञ्जयस्फुलिङ्गभा\nनिपीतपञ्चसायकं नमन्निलिम्पनायकम् ।\nसुधामयूखलेखया विराजमानशेखरं\nमहाकपालिसम्पदे शिरोजटालमस्तु नः ॥६॥",
      meaning: "May the matted locks of Lord Shiva, which consumed Kamadeva (the god of love with five arrows) with the sparks of the fire burning on His broad forehead, who is bowed down to by the king of gods (Indra), and who is adorned with a crescent moon showering nectar, bring us great wealth and prosperity."
    },
    { type: 'shloka', num: 7, text: "Karala bhala pattika dhagaddhagaddhagajjvalad\nDhananjaya hutikruta prachandapanchasayake\nDharadharendra nandini kuchagrachitrapatraka\nPrakalpanaikashilpini trilochane ratirmama",
      sanskrit: "करालभालपट्टिकाधगद्धगद्धगज्ज्वलद्\nधनञ्जयाहुतीकृतप्रचण्डपञ्चसायके ।\nधराधरेन्द्रनन्दिनीकुचाग्रचित्रपत्रक\nप्रकल्पनैकशिल्पिनि त्रिलोचने रतिर्मम ॥७॥",
      meaning: "My mind is devoted to the three-eyed Lord Shiva, who offered the powerful god of love into the fiercely blazing fire on the flat surface of His terrifying forehead, and who is the sole expert in drawing decorative patterns on the breasts of Parvati."
    },
    { type: 'shloka', num: 8, text: "Navina megha mandali niruddhadurdharasphurat\nKuhu nishithinitamah prabandhabaddhakandharah\nNilimpanirjhari dharastanotu krutti sindhurah\nKalanidhanabandhurah shriyam jagaddhurandharah",
      sanskrit: "नवीनमेघमण्डली निरुद्धदुर्धरस्फुरत्\nकुहूनिशीथिनीतमः प्रबन्धबद्धकन्धरः ।\nनिलिम्पनिर्झरीधरस्तनोतु कृत्तिसिन्धुरः\nकलानिधानबन्धुरः श्रियं जगद्धुरन्धरः ॥८॥",
      meaning: "May Lord Shiva, whose neck is as dark as the midnight of a new moon night completely covered by thick new clouds, who holds the celestial river Ganga, who wears the hide of a huge elephant, who is beautiful with the crescent moon (the receptacle of digits), and who carries the burden of the universe, grant us prosperity."
    },
    { type: 'shloka', num: 9, text: "Praphulla nila pankaja prapanchakalimaprabha\nValambikntha kandali ruchi prabaddhakandharam\nSmarachchidam purachchidam bhavachchidam makhachchidam\nGajachchidandhakachchidam tamantakachchidam bhaje",
      sanskrit: "प्रफुल्लनीलपङ्कजप्रपञ्चकालिमप्रभा\nवलम्बिकण्ठकन्दलीरुचिप्रबद्धकन्धरम् ।\nस्मरच्छिदं पुरच्छिदं भवच्छिदं मखच्छिदं\nगजच्छिदान्ध कच्छिदं तमन्तकच्छिदं भजे ॥९॥",
      meaning: "I worship Lord Shiva, whose neck is radiant with the dark beauty of a fully bloomed blue lotus, who destroyed the god of love (Kamadeva), the three cities (Tripura), worldly existence, Daksha's sacrifice, the demon Gajasura, the demon Andhaka, and even controlled Yama (the god of death)."
    },
    { type: 'shloka', num: 10, text: "Akharvagarvasarvamangala kalakadambamanjari\nRasapravaha madhuri jrumbhamana madhuvratam\nSmarantakam purantakam bhavantakam makhantakam\nGajantakandhakantakam tamantakantakam bhaje",
      sanskrit: "अखर्वसर्वमङ्गलाकलाकदम्बमञ्जरी\nरसप्रवाहमाधुरीविजृम्भणा मधुव्रतम् ।\nस्मरान्तकं पुरान्तकं भवान्तकं मखान्तकं\nगजान्तकान्धकान्तकं तमन्तकान्तकं भजे ॥१०॥",
      meaning: "I worship Lord Shiva, around whom bees hover to drink the expanding sweetness of the endless joy flowing from the beautiful kadamba flower-like auspiciousness (Parvati), who is the destroyer of Kamadeva, Tripura, the cycle of birth and death, Daksha's sacrifice, Gajasura, Andhakasura, and Yama."
    },
    { type: 'shloka', num: 11, text: "Jayatvadabhravibhrama bhramadbhujangamashvasa\nVinirgamatkramasphurat karalabhaala havyavat\nDhimiddhimidhimidhvanan mrudangatungamangala\nDhvanikramapravartita prachanda tandavah shivah",
      sanskrit: "जयत्वदभ्रविभ्रमभ्रमद्भुजङ्गमश्वस\nद्विनिर्गमत्क्रमस्फुरत्करालभालहव्यवाट् ।\nधिमिद्धिमिद्धिमिध्वनन्मृदङ्गतुङ्गमङ्गल\nध्वनिक्रमप्रवर्तितप्रचण्डताण्डवः शिवः ॥११॥",
      meaning: "Victory to Lord Shiva, whose terrifying forehead-fire blazes fiercely, fanned by the breath of the fast-moving snakes roaming in a state of agitation, and who performs His fierce Tandava dance perfectly matching the rhythmic and auspicious 'dhimid, dhimid, dhimid' sounds of the mrudanga."
    },
    { type: 'shloka', num: 12, text: "Drushadvichitratalpayor bhujangamauktikasrajor\nGarishtharatnaloshtayoh suhrudvipakshapakshayoh\nTrunaravindachakshushoh prajamahimahendrayoh\nSamam pravrutikah kada sadashivam bhajamyaham",
      sanskrit: "दृषद्विचित्रतल्पयोर्भुजङ्गमौक्तिकस्रजोर्\nगरिष्ठरत्नलोष्टयोः सुहृद्विपक्षपक्षयोः ।\nतृणारविन्दचक्षुषोः प्रजामहीमहेन्द्रयोः\nसमं प्रवृत्तिकः कदा सदाशिवं भजाम्यहम् ॥१२॥",
      meaning: "When will I be able to worship Lord Sadashiva consistently, having equal disposition towards a stone or a fancy bed, a snake or a garland of pearls, a precious gem or a lump of dirt, a friend or a foe, a blade of grass or a beautiful woman, a commoner or a great king?"
    }
  ]
};

export const achyutashtakam: SacredTextContent = {
  title: "Achyutashtakam",
  subtitle: "A sweet hymn to the infallible Lord",
  themeColor: "purple",
  youtubeId: "lQj-cI37C8A",
  verses: [
    { type: 'shloka', num: 1, text: "Achyutam Keshavam Rama Narayanam\nKrishna Damodaram Vasudevam Harim\nShri Dharam Madhavam Gopika Vallabham\nJanaki Nayakam Ramachandram Bhaje",
      sanskrit: "अच्युतं केशवं रामनारायणं\nकृष्णदामोदरं वासुदेवं हरिम् ।\nश्रीधरं माधवं गोपिकावल्लभं\nजानकीनायकं रामचन्द्रं भजे ॥ १ ॥",
      meaning: "I sing praise to Achyuta (the infallible one), Keshava, Rama, Narayana, Krishna, Damodara, Vasudeva, Hari, Shridhara, Madhava, the beloved of the Gopikas, and Ramachandra, the lord of Janaki."
    },
    { type: 'shloka', num: 2, text: "Achyutam Keshavam Satyabhamadhavam\nMadhavam Shridharam Radhikaaradhikam\nIndira Mandiram Chetasa Sundaram\nDevaki Nandanam Nandajam Sandadhe",
      sanskrit: "अच्युतं केशवं सत्यभामाधवं\nमाधवं श्रीधरं राधिकाराधितम् ।\nइन्दिरामन्दिरं चेतसा सुन्दरं\nदेवकीनन्दनं नन्दजं सन्दधे ॥ २ ॥",
      meaning: "I meditate on Achyuta, Keshava, the lord of Satyabhama, Madhava, Shridhara, the one worshipped by Radhika, the temple of Lakshmi, the one with a beautiful heart, the son of Devaki and Nanda."
    }
  ]
};

export const sriKrishnaAshtakam: SacredTextContent = {
  title: "Sri Krishna Ashtakam",
  subtitle: "A divine hymn to Lord Krishna",
  themeColor: "purple",
  youtubeId: "vBw22xTInq0",
  verses: [
    { type: 'shloka', num: 1, text: "Vasudeva sutam devam kamsa chanura mardanam\nDevaki paramanandam krishnam vande jagad gurum",
      sanskrit: "वसुदेव सुतं देवं कंस चाणूर मर्दनम् ।\nदेवकी परमानन्दं कृष्णं वन्दे जगद्गुरुम् ॥",
      meaning: "I worship Lord Krishna, who is the spiritual master of the universe, who is the son of Vasudeva, who is the Lord, who killed Kamsa and Chanura, and who is the bliss of Mother Devaki."
    },
    { type: 'shloka', num: 2, text: "Atasi pushpa sankasham hara nupura shobhitam\nRatna kankana keyuram krishnam vande jagad gurum",
      sanskrit: "अतसी पुष्प सङ्काशं हार नूपुर शोभितम् ।\nरत्न कङ्कण केयूरं कृष्णं वन्दे जगद्गुरुम् ॥",
      meaning: "I worship Lord Krishna, the spiritual master of the universe, whose complexion is like the Atasi flower, who is adorned with a garland of flowers and anklets, and who wears armlets and bracelets made of jewels."
    },
    { type: 'shloka', num: 3, text: "Kutilalaka samyuktam purnachandra nibhananam\nVilasat kundaladharam krishnam vande jagad gurum",
      sanskrit: "कुटिलालक संयुक्तं पूर्णचन्द्र निभाननम् ।\nविलसत् कुण्डलधरं कृष्णं वन्दे जगद्गुरुम् ॥",
      meaning: "I worship Lord Krishna, the spiritual master of the universe, who has curly hair, whose face is like the full moon, and who wears shining earrings."
    },
    { type: 'shloka', num: 4, text: "Mandara gandha samyuktam charuhasam chaturbhujam\nBarhi pinchha vachudangam krishnam vande jagad gurum",
      sanskrit: "मन्दार गन्ध संयुक्तं चारुहासं चतुर्भुजम् ।\nबर्हि पिञ्छ वचूडाङ्गं कृष्णं वन्दे जगद्गुरुम् ॥",
      meaning: "I worship Lord Krishna, the spiritual master of the universe, who is fragrant with the Mandara flower, who has a beautiful smile, who is four-armed, and whose head is adorned with a peacock feather."
    },
    { type: 'shloka', num: 5, text: "Utphulla padmapatraksham nila jimuta sannibham\nYadavanam shiroratnam krishnam vande jagad gurum",
      sanskrit: "उत्फुल्ल पद्मपत्राक्षं नील जीमूत सन्निभम् ।\nयादवानां शिरोरत्नं कृष्णं वन्दे जगद्गुरुम् ॥",
      meaning: "I worship Lord Krishna, the spiritual master of the universe, whose eyes are like fully blown lotus petals, whose complexion is like a dark blue cloud, and who is the crest jewel of the Yadava dynasty."
    }
  ]
};

export const getSacredText = (deity?: string): SacredTextContent => {
  if (deity === 'shiva') return shivaTandavaStotram;
  if (deity === 'krishna') return sriKrishnaAshtakam;
  return hanumanChalisa;
};
