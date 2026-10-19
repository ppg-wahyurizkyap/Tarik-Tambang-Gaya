import { Question } from '../types/game';

export const QUESTION_BANK: Question[] = [
  // ==========================================
  // KATEGORI 1: PENGERTIAN GAYA & PENGARUHNYA (15 Soal)
  // ==========================================
  {
    id: 'pg-1',
    text: 'Dalam sains, apa yang dimaksud dengan gaya?',
    type: 'multiple_choice',
    options: ['Tarikan atau dorongan yang diberikan pada suatu benda', 'Bentuk dan warna yang dimiliki oleh sebuah benda', 'Kecepatan benda saat melaju di jalan tol', 'Berat benda ketika ditimbang dengan timbangan'],
    correctAnswer: 0,
    explanation: 'Gaya adalah tarikan atau dorongan yang dapat menyebabkan benda bergerak, berhenti, berubah arah, atau berubah bentuk.',
    category: 'pengertian_pengaruh',
    difficulty: 'mudah',
    frictionTag: 'konsep'
  },
  {
    id: 'pg-2',
    text: 'Saat kamu membuka pintu kulkas dengan menarik pegangannya, kamu sedang memberikan ...',
    type: 'multiple_choice',
    options: ['Gaya dorongan', 'Gaya tarikan', 'Gaya pantulan', 'Gaya magnet bumi'],
    correctAnswer: 1,
    explanation: 'Menarik pegangan pintu kulkas ke arah badan kita merupakan contoh pemberian gaya tarikan.',
    category: 'pengertian_pengaruh',
    difficulty: 'mudah',
    frictionTag: 'konsep'
  },
  {
    id: 'pg-3',
    text: 'Seorang kiper menangkap bola yang melesat kencang sehingga bola berhenti bergerak. Hal ini membuktikan bahwa gaya dapat ...',
    type: 'multiple_choice',
    options: ['Mengubah warna bola menjadi lebih gelap', 'Menghentikan gerak benda', 'Menambah berat bola sepak', 'Mengubah bola menjadi benda cair'],
    correctAnswer: 1,
    explanation: 'Kiper memberikan gaya dorong/tahanan dari tangannya yang membuat bola yang tadinya meluncur menjadi berhenti.',
    category: 'pengertian_pengaruh',
    difficulty: 'mudah',
    frictionTag: 'konsep'
  },
  {
    id: 'pg-4',
    text: 'Beni meremas plastisin (lilin mainan) hingga bentuknya berubah menjadi patung kura-kura. Peristiwa ini menunjukkan bahwa gaya dapat ...',
    type: 'multiple_choice',
    options: ['Mengubah wujud benda menjadi gas', 'Mengubah bentuk benda', 'Membuat benda menjadi magnet', 'Menghilangkan massa benda'],
    correctAnswer: 1,
    explanation: 'Tekanan tangan Beni memberikan gaya otot yang mampu meremas dan mengubah bentuk plastisin.',
    category: 'pengertian_pengaruh',
    difficulty: 'mudah',
    frictionTag: 'konsep'
  },
  {
    id: 'pg-5',
    text: 'Pemain bulu tangkis memukul kok yang datang dari lawan ke arah sisi lapangan kiri. Pengaruh gaya yang terjadi pada kok adalah ...',
    type: 'multiple_choice',
    options: ['Mengubah arah gerak benda', 'Mengubah massa bulu kok', 'Membuat kok menjadi elastis', 'Menghentikan kok selamanya di udara'],
    correctAnswer: 0,
    explanation: 'Pukulan raket memberikan gaya yang membalikkan dan mengubah arah meluncurnya kok di udara.',
    category: 'pengertian_pengaruh',
    difficulty: 'sedang',
    frictionTag: 'konsep'
  },
  {
    id: 'pg-6',
    text: 'Pernyataan: "Gaya hanya bisa menyebabkan benda yang diam menjadi bergerak, tidak bisa hal yang lain."',
    type: 'true_false',
    options: ['Benar', 'Salah'],
    correctAnswer: 1,
    explanation: 'Salah! Gaya juga dapat menghentikan gerak benda, mengubah arah gerak benda, serta mengubah bentuk benda.',
    category: 'pengertian_pengaruh',
    difficulty: 'mudah',
    frictionTag: 'miskonsepsi'
  },
  {
    id: 'pg-7',
    text: 'Ketika Doni mendorong meja belajar dari pojok kamar ke dekat jendela, Doni telah melakukan ...',
    type: 'multiple_choice',
    options: ['Perpindahan benda akibat gaya dorong', 'Pengurangan gaya gravitasi pada meja', 'Pengubahan bentuk kayu menjadi lentur', 'Pemberian gaya magnet pada meja'],
    correctAnswer: 0,
    explanation: 'Gaya dorongan Doni menghasilkan perpindahan posisi meja dari satu tempat ke tempat lainnya.',
    category: 'pengertian_pengaruh',
    difficulty: 'mudah',
    frictionTag: 'konsep'
  },
  {
    id: 'pg-8',
    text: 'Ibu memotong adonan roti menggunakan pisau. Adonan roti yang besar terbelah menjadi dua. Pengaruh gaya dalam kegiatan ini adalah ...',
    type: 'multiple_choice',
    options: ['Mengubah rasa kue', 'Mengubah bentuk adonan', 'Membuat adonan melayang', 'Menghilangkan gaya gesek adonan'],
    correctAnswer: 1,
    explanation: 'Gaya tekan dan geser dari mata pisau mengubah bentuk adonan utuh menjadi dua bagian terpisah.',
    category: 'pengertian_pengaruh',
    difficulty: 'sedang',
    frictionTag: 'konsep'
  },
  {
    id: 'pg-9',
    text: 'Mobil yang sedang melaju tiba-tiba berbelok ke kanan saat sopir memutar setir. Hal ini adalah contoh pengaruh gaya dapat ...',
    type: 'multiple_choice',
    options: ['Mengubah bentuk mobil', 'Mengubah arah gerak kendaraan', 'Menghilangkan gaya gravitasi', 'Mengurangi berat mobil'],
    correctAnswer: 1,
    explanation: 'Putaran setir mengarahkan ban depan, sehingga gaya gesek jalan membelokkan arah gerak mobil.',
    category: 'pengertian_pengaruh',
    difficulty: 'mudah',
    frictionTag: 'konsep'
  },
  {
    id: 'pg-10',
    text: 'Pernyataan: "Mendorong kereta belanja di supermarket merupakan contoh penerapan gaya dorongan."',
    type: 'true_false',
    options: ['Benar', 'Salah'],
    correctAnswer: 0,
    explanation: 'Benar! Mendorong troli menjauhi tubuh kita adalah bentuk nyata gaya dorong.',
    category: 'pengertian_pengaruh',
    difficulty: 'mudah',
    frictionTag: 'konsep'
  },
  {
    id: 'pg-11',
    text: 'Manakah dari kegiatan berikut yang merupakan contoh gaya berupa TARIKAN?',
    type: 'multiple_choice',
    options: ['Menendang bola ke gawang', 'Menimba air dari dalam sumur', 'Menekan tombol bel rumah', 'Mendorong pintu gerbang sekolah'],
    correctAnswer: 1,
    explanation: 'Menimba air sumur menarik tali ke arah atas/tubuh sehingga ember air terangkat naik.',
    category: 'pengertian_pengaruh',
    difficulty: 'mudah',
    frictionTag: 'konsep'
  },
  {
    id: 'pg-12',
    text: 'Sebuah kaleng minuman kosong diinjak oleh Edo hingga menjadi gepeng. Peristiwa tersebut membuktikan gaya dapat ...',
    type: 'multiple_choice',
    options: ['Mengubah warna kaleng', 'Mengubah bentuk kaleng', 'Memperbesar massa kaleng', 'Membuat kaleng melayang'],
    correctAnswer: 1,
    explanation: 'Gaya injakan kaki Edo memberikan tekanan yang mengubah bentuk kaleng silinder menjadi penyok/gepeng.',
    category: 'pengertian_pengaruh',
    difficulty: 'mudah',
    frictionTag: 'konsep'
  },
  {
    id: 'pg-13',
    text: 'Pernyataan: "Benda yang sedang bergerak lurus tidak dapat dipercepat kecepatannya oleh gaya."',
    type: 'true_false',
    options: ['Benar', 'Salah'],
    correctAnswer: 1,
    explanation: 'Salah! Jika benda yang sedang bergerak diberikan dorongan searah geraknya, kecepatannya akan bertambah kencang.',
    category: 'pengertian_pengaruh',
    difficulty: 'sedang',
    frictionTag: 'miskonsepsi'
  },
  {
    id: 'pg-14',
    text: 'Alat ukur sederhana yang biasa digunakan di laboratorium sekolah untuk mengukur besar gaya adalah ...',
    type: 'multiple_choice',
    options: ['Termometer', 'Dinamometer (neraca pegas)', 'Mikrometer sekrup', 'Barometer'],
    correctAnswer: 1,
    explanation: 'Dinamometer atau neraca pegas bekerja berdasarkan prinsip keelastisan pegas untuk mengukur besar gaya.',
    category: 'pengertian_pengaruh',
    difficulty: 'sulit',
    frictionTag: 'konsep'
  },
  {
    id: 'pg-15',
    text: 'Apa yang terjadi pada kelereng yang sedang menggelinding di lantai ubin jika disentuh ujung jarimu ke arah yang berlawanan?',
    type: 'multiple_choice',
    options: ['Kelereng bergerak makin cepat', 'Kelereng melambat atau berhenti', 'Kelereng berubah menjadi cairan', 'Kelereng langsung terbakar'],
    correctAnswer: 1,
    explanation: 'Gaya tahanan berlawanan arah dari jarimu akan memperlambat laju atau menghentikan putaran kelereng.',
    category: 'pengertian_pengaruh',
    difficulty: 'sedang',
    frictionTag: 'konsep'
  },

  // ==========================================
  // KATEGORI 2: GAYA OTOT (10 Soal)
  // ==========================================
  {
    id: 'go-1',
    text: 'Dari manakah sumber utama gaya otot dihasilkan?',
    type: 'multiple_choice',
    options: ['Dari kontraksi dan relaksasi otot manusia atau hewan', 'Dari aliran listrik bertegangan tinggi di kabel', 'Dari magnet yang ada di dalam tanah bumi', 'Dari gesekan antara udara dan air hujan'],
    correctAnswer: 0,
    explanation: 'Gaya otot timbul karena kerja kontraksi dan relaksasi otot tubuh makhluk hidup (manusia maupun hewan).',
    category: 'gaya_otot',
    difficulty: 'mudah',
    frictionTag: 'konsep'
  },
  {
    id: 'go-2',
    text: 'Peristiwa berikut yang memanfaatkan gaya otot hewan untuk membantu pekerjaan manusia adalah ...',
    type: 'multiple_choice',
    options: ['Kompas yang menunjukkan arah utara', 'Kuda yang menarik delman di jalan', 'Magnet yang menempel di pintu kulkas', 'Penggaris plastik menarik sobekan kertas'],
    correctAnswer: 1,
    explanation: 'Kuda menggunakan kekuatan otot kakinya untuk menarik delman dan mengangkut penumpang.',
    category: 'gaya_otot',
    difficulty: 'mudah',
    frictionTag: 'konsep'
  },
  {
    id: 'go-3',
    text: 'Rina mengangkat kardus buku yang cukup berat dari lantai ke atas meja belajarnya. Rina memanfaatkan gaya ...',
    type: 'multiple_choice',
    options: ['Gaya pegas', 'Gaya otot', 'Gaya magnet', 'Gaya gravitasi bulan'],
    correctAnswer: 1,
    explanation: 'Mengangkat beban berat memerlukan tenaga dari kontraksi otot tangan dan kaki manusia.',
    category: 'gaya_otot',
    difficulty: 'mudah',
    frictionTag: 'konsep'
  },
  {
    id: 'go-4',
    text: 'Pernyataan: "Hanya manusia yang dapat menghasilkan gaya otot, hewan tidak bisa menghasilkan gaya otot."',
    type: 'true_false',
    options: ['Benar', 'Salah'],
    correctAnswer: 1,
    explanation: 'Salah! Hewan seperti kuda delman, sapi penarik bajak sawah, dan kerbau juga menggunakan gaya otot tubuh mereka.',
    category: 'gaya_otot',
    difficulty: 'mudah',
    frictionTag: 'miskonsepsi'
  },
  {
    id: 'go-5',
    text: 'Saat bermain tarik tambang di halaman sekolah, gaya utama yang dikerahkan oleh setiap regu adalah ...',
    type: 'multiple_choice',
    options: ['Gaya listrik', 'Gaya otot tangan dan kaki', 'Gaya magnet buatan', 'Gaya apung air'],
    correctAnswer: 1,
    explanation: 'Permainan tarik tambang mengandalkan kekuatan otot tangan untuk menggenggam tali dan otot kaki untuk berpijak kokoh.',
    category: 'gaya_otot',
    difficulty: 'mudah',
    frictionTag: 'konsep'
  },
  {
    id: 'go-6',
    text: 'Pak Tani membajak sawah berlumpur dengan bantuan dua ekor kerbau. Gaya yang digunakan kerbau untuk menarik mata bajak adalah ...',
    type: 'multiple_choice',
    options: ['Gaya pegas', 'Gaya otot kerbau', 'Gaya magnet bumi', 'Gaya gesek kerbau'],
    correctAnswer: 1,
    explanation: 'Kerbau mengerahkan gaya ototnya untuk menarik alat bajak menembus tanah sawah yang gembur.',
    category: 'gaya_otot',
    difficulty: 'mudah',
    frictionTag: 'konsep'
  },
  {
    id: 'go-7',
    text: 'Kegiatan berikut yang BUKAN merupakan contoh pemanfaatan gaya otot adalah ...',
    type: 'multiple_choice',
    options: ['Mengayuh sepeda saat berangkat ke sekolah', 'Menendang bola sepak menuju tiang gawang', 'Jarum kompas menunjuk ke arah kutub utara', 'Mendorong gerobak bakso keliling kampung'],
    correctAnswer: 2,
    explanation: 'Jarum kompas berputar karena tarikan gaya magnet bumi, bukan karena gaya otot.',
    category: 'gaya_otot',
    difficulty: 'sedang',
    frictionTag: 'konsep'
  },
  {
    id: 'go-8',
    text: 'Pernyataan: "Saat kita berolahraga push-up, otot lengan kita bekerja keras memberikan gaya dorong ke lantai."',
    type: 'true_false',
    options: ['Benar', 'Salah'],
    correctAnswer: 0,
    explanation: 'Benar! Gerakan push-up memanfaatkan kekuatan gaya otot dada dan lengan untuk mengangkat berat tubuh.',
    category: 'gaya_otot',
    difficulty: 'mudah',
    frictionTag: 'konsep'
  },
  {
    id: 'go-9',
    text: 'Mengapa tubuh kita membutuhkan makanan bergizi dan istirahat yang cukup berkaitan dengan gaya otot?',
    type: 'multiple_choice',
    options: ['Agar tubuh menjadi magnet yang kuat', 'Agar otot menghasilkan energi untuk mengerahkan gaya', 'Agar tubuh tidak terpengaruh gaya gesek tanah', 'Agar sepatu kita tidak mudah aus'],
    correctAnswer: 1,
    explanation: 'Energi kimia dari makanan diperlukan oleh sel-sel otot agar mampu berkontraksi dan menghasilkan gaya dorong/tarik.',
    category: 'gaya_otot',
    difficulty: 'sedang',
    frictionTag: 'konsep'
  },
  {
    id: 'go-10',
    text: 'Ketika seorang pemanah menarik tali busur, gaya yang digunakan jari pemanah untuk menarik tali tersebut adalah gaya ...',
    type: 'multiple_choice',
    options: ['Gaya otot pemanah', 'Gaya magnet bumi', 'Gaya gesek tali', 'Gaya gravitasi udara'],
    correctAnswer: 0,
    explanation: 'Jari dan lengan pemanah menggunakan gaya otot untuk menarik tali busur ke belakang sebelum dilepaskan.',
    category: 'gaya_otot',
    difficulty: 'sedang',
    frictionTag: 'konsep'
  },

  // ==========================================
  // KATEGORI 3: GAYA PEGAS (10 Soal)
  // ==========================================
  {
    id: 'gp-1',
    text: 'Gaya pegas timbul pada benda yang memiliki sifat khusus, yaitu sifat ...',
    type: 'multiple_choice',
    options: ['Rapuh dan mudah pecah', 'Elastis atau lentur dan dapat kembali ke bentuk semula', 'Cair dan mengalir ke tempat rendah', 'Keras seperti batu kali'],
    correctAnswer: 1,
    explanation: 'Gaya pegas dihasilkan oleh benda elastis yang kembali ke bentuk semula setelah diregangkan atau ditekan.',
    category: 'gaya_pegas',
    difficulty: 'mudah',
    frictionTag: 'konsep'
  },
  {
    id: 'gp-2',
    text: 'Benda permainan berikut yang memanfaatkan kelenturan gaya pegas untuk melontarkan batu kecil adalah ...',
    type: 'multiple_choice',
    options: ['Ketapel', 'Gasing bambu', 'Layang-layang kertas', 'Kelereng kaca'],
    correctAnswer: 0,
    explanation: 'Karet ketapel yang ditarik akan meregang, dan saat dilepas karet menghasilkan gaya pegas yang melontarkan kerikil.',
    category: 'gaya_pegas',
    difficulty: 'mudah',
    frictionTag: 'konsep'
  },
  {
    id: 'gp-3',
    text: 'Saat anak-anak melompat gembira di atas trampolin, mereka terlempar ke atas karena bantuan gaya ...',
    type: 'multiple_choice',
    options: ['Gaya magnet', 'Gaya pegas dari per trampolin', 'Gaya gesek udara', 'Gaya gravitasi bumi'],
    correctAnswer: 1,
    explanation: 'Pegas dan jaring elastis pada trampolin menekan kembali ke atas saat terinjak, memberikan gaya pegas pelontar.',
    category: 'gaya_pegas',
    difficulty: 'mudah',
    frictionTag: 'konsep'
  },
  {
    id: 'gp-4',
    text: 'Pernyataan: "Karet gelang yang diregangkan semakin jauh akan memberikan gaya dorong yang semakin kuat ketika dilepaskan."',
    type: 'true_false',
    options: ['Benar', 'Salah'],
    correctAnswer: 0,
    explanation: 'Benar! Semakin jauh benda elastis diregangkan dalam batas elastisitasnya, semakin besar gaya pegas yang disimpannya.',
    category: 'gaya_pegas',
    difficulty: 'mudah',
    frictionTag: 'konsep'
  },
  {
    id: 'gp-5',
    text: 'Kasur spring bed terasa empuk dan nyaman ditiduri karena di dalamnya dipasangi susunan ...',
    type: 'multiple_choice',
    options: ['Magnet batang', 'Per atau pegas baja spiral', 'Pelumas oli mesin', 'Pasir pantai halus'],
    correctAnswer: 1,
    explanation: 'Per baja spiral di dalam kasur bekerja dengan gaya pegas meredam beban tubuh saat berbaring.',
    category: 'gaya_pegas',
    difficulty: 'mudah',
    frictionTag: 'konsep'
  },
  {
    id: 'gp-6',
    text: 'Pernyataan: "Kaca jendela rumah menghasilkan gaya pegas ketika terbentur bola."',
    type: 'true_false',
    options: ['Benar', 'Salah'],
    correctAnswer: 1,
    explanation: 'Salah! Kaca bukan benda elastis, melainkan benda kaku dan getas yang dapat pecah bila terkena benturan.',
    category: 'gaya_pegas',
    difficulty: 'mudah',
    frictionTag: 'miskonsepsi'
  },
  {
    id: 'gp-7',
    text: 'Alat peredam kejut (shockbreaker) pada sepeda motor berfungsi membuat perjalanan tetap nyaman di jalan bergelombang berkat adanya ...',
    type: 'multiple_choice',
    options: ['Pegas spiral dan hidrolik penahan getaran', 'Magnet penolak aspal jalan', 'Roda gigi yang diperkasar permukaannya', 'Kabel listrik penghantar daya'],
    correctAnswer: 0,
    explanation: 'Shockbreaker motor memiliki pegas besar yang meredam guncangan jalan bergelombang.',
    category: 'gaya_pegas',
    difficulty: 'sedang',
    frictionTag: 'konsep'
  },
  {
    id: 'gp-8',
    text: 'Busur panah mampu meluncurkan anak panah menancap sasaran karena adanya gaya ...',
    type: 'multiple_choice',
    options: ['Gaya gravitasi tali', 'Gaya pegas dari regangan tali dan busur', 'Gaya magnet ujung mata panah', 'Gaya gesek udara'],
    correctAnswer: 1,
    explanation: 'Tali busur yang diregangkan menyimpan energi potensial elastis yang berubah menjadi gaya pegas pelontar.',
    category: 'gaya_pegas',
    difficulty: 'mudah',
    frictionTag: 'konsep'
  },
  {
    id: 'gp-9',
    text: 'Benda manakah di bawah ini yang BUKAN merupakan contoh benda elastis pembuat gaya pegas?',
    type: 'multiple_choice',
    options: ['Karet penghapus yang lentur', 'Per pulpen cetik', 'Batu bata merah yang keras', 'Tali busur panah'],
    correctAnswer: 2,
    explanation: 'Batu bata merah adalah benda kaku tak elastis dan tidak menghasilkan gaya pegas bila ditekan.',
    category: 'gaya_pegas',
    difficulty: 'mudah',
    frictionTag: 'konsep'
  },
  {
    id: 'gp-10',
    text: 'Pernyataan: "Pulpen cetik (retractable pen) menggunakan per pegas kecil di dalamnya untuk memunculkan dan menyembunyikan ujung mata pena."',
    type: 'true_false',
    options: ['Benar', 'Salah'],
    correctAnswer: 0,
    explanation: 'Benar! Pegas kecil di dalam pulpen cetik mendorong mekanisme pengunci mata pena.',
    category: 'gaya_pegas',
    difficulty: 'mudah',
    frictionTag: 'konsep'
  },

  // ==========================================
  // KATEGORI 4: GAYA MAGNET (10 Soal)
  // ==========================================
  {
    id: 'gm-1',
    text: 'Apa yang dimaksud dengan gaya magnet?',
    type: 'multiple_choice',
    options: ['Gaya tarik atau tolak yang dihasilkan oleh medan magnet', 'Gaya yang dihasilkan oleh otot hewan berlari', 'Gaya hambat saat dua permukaan kayu digosok', 'Gaya lentur karet saat diregangkan'],
    correctAnswer: 0,
    explanation: 'Gaya magnet adalah gaya tarikan atau dorongan (tolakan) yang ditimbulkan oleh magnet.',
    category: 'gaya_magnet',
    difficulty: 'mudah',
    frictionTag: 'konsep'
  },
  {
    id: 'gm-2',
    text: 'Manakah kelompok benda berikut yang SELURUHNYA dapat ditarik oleh magnet?',
    type: 'multiple_choice',
    options: ['Paku besi, klip kertas baja, dan jarum jahit', 'Pensil kayu, penghapus karet, dan daun kering', 'Kertas buku, botol plastik, dan sendok kayu', 'Batu kerikil, kaca cermin, dan kain katun'],
    correctAnswer: 0,
    explanation: 'Besi dan baja merupakan benda feromagnetik yang dapat ditarik kuat oleh magnet.',
    category: 'gaya_magnet',
    difficulty: 'mudah',
    frictionTag: 'konsep'
  },
  {
    id: 'gm-3',
    text: 'Pernyataan: "Semua jenis logam tanpa terkecuali pasti bisa ditarik oleh magnet."',
    type: 'true_false',
    options: ['Benar', 'Salah'],
    correctAnswer: 1,
    explanation: 'Salah! Tidak semua logam ditarik magnet. Emas murni, perak, tembaga, dan aluminium tidak dapat ditarik oleh magnet biasa.',
    category: 'gaya_magnet',
    difficulty: 'sedang',
    frictionTag: 'miskonsepsi'
  },
  {
    id: 'gm-4',
    text: 'Pintu kulkas di rumah dapat menutup rapat dengan sendirinya ketika didekatkan karena di dalam karet pintunya terdapat ...',
    type: 'multiple_choice',
    options: ['Lem perekat cair yang lengket', 'Magnet elastis penyerap panas', 'Pegas kawat bertegangan tinggi', 'Pelumas minyak pelicin'],
    correctAnswer: 1,
    explanation: 'Gasket karet kulkas dilapisi magnet lentur yang tertarik ke badan kulkas yang terbuat dari logam besi.',
    category: 'gaya_magnet',
    difficulty: 'mudah',
    frictionTag: 'konsep'
  },
  {
    id: 'gm-5',
    text: 'Jika kutub UTARA sebuah magnet didekatkan dengan kutub UTARA magnet lainnya, apa yang akan terjadi?',
    type: 'multiple_choice',
    options: ['Kedua magnet akan saling tarik-menarik erat', 'Kedua magnet akan saling tolak-menolak', 'Kedua magnet akan langsung kehilangan kemagnetannya', 'Kedua magnet meleleh seketika'],
    correctAnswer: 1,
    explanation: 'Kutub magnet yang senama (Utara dengan Utara, atau Selatan dengan Selatan) akan saling tolak-menolak.',
    category: 'gaya_magnet',
    difficulty: 'mudah',
    frictionTag: 'konsep'
  },
  {
    id: 'gm-6',
    text: 'Alat penunjuk arah yang menggunakan jarum magnet kecil yang selalu mengarah ke utara dan selatan bumi dinamakan ...',
    type: 'multiple_choice',
    options: ['Kompas', 'Dinamometer', 'Spidometer', 'Altimeter'],
    correctAnswer: 0,
    explanation: 'Kompas memanfaatkan jarum magnet yang bebas berputar mensejajarkan diri dengan medan magnet bumi.',
    category: 'gaya_magnet',
    difficulty: 'mudah',
    frictionTag: 'konsep'
  },
  {
    id: 'gm-7',
    text: 'Pernyataan: "Magnet memerlukan sentuhan fisik langsung agar dapat menarik benda besi."',
    type: 'true_false',
    options: ['Benar', 'Salah'],
    correctAnswer: 1,
    explanation: 'Salah! Gaya magnet adalah gaya tak sentuh; magnet tetap bisa menarik paku besi dari jarak tertentu di dalam medan magnetnya.',
    category: 'gaya_magnet',
    difficulty: 'sedang',
    frictionTag: 'miskonsepsi'
  },
  {
    id: 'gm-8',
    text: 'Di tempat penampungan barang bekas, sebuah derek besar mengangkat tumpukan besi tua tanpa rantai kait dengan menggunakan ...',
    type: 'multiple_choice',
    options: ['Gaya elektromagnetik raksasa', 'Gaya pegas baja raksasa', 'Gaya gesek permukaan besi', 'Gaya dorong angin kencang'],
    correctAnswer: 0,
    explanation: 'Alat pengangkat besi industri menggunakan elektromagnet kuat yang dinyalakan dengan aliran listrik.',
    category: 'gaya_magnet',
    difficulty: 'sedang',
    frictionTag: 'konsep'
  },
  {
    id: 'gm-9',
    text: 'Manakah dari peralatan elektronik berikut yang memanfaatkan magnet pada pengeras suaranya?',
    type: 'multiple_choice',
    options: ['Speaker dan earphone', 'Lampu bohlam pijar', 'Panci masak aluminium', 'Cangkir keramik'],
    correctAnswer: 0,
    explanation: 'Speaker menggunakan kumparan kawat dan magnet permanen untuk menggetarkan membran udara penghasil suara.',
    category: 'gaya_magnet',
    difficulty: 'sedang',
    frictionTag: 'konsep'
  },
  {
    id: 'gm-10',
    text: 'Jika kutub UTARA magnet didekatkan ke kutub SELATAN magnet lain, peristiwa yang terjadi adalah ...',
    type: 'multiple_choice',
    options: ['Tolak-menolak menjauh', 'Tarik-menarik merapat', 'Tidak terjadi reaksi apapun', 'Kutub magnet berputar tanpa henti'],
    correctAnswer: 1,
    explanation: 'Kutub magnet yang tidak senama (berlawanan jenis) akan saling tarik-menarik.',
    category: 'gaya_magnet',
    difficulty: 'mudah',
    frictionTag: 'konsep'
  },

  // ==========================================
  // KATEGORI 5: MANFAAT DAN KERUGIAN GAYA GESEK (15 Soal)
  // ==========================================
  {
    id: 'mg-1',
    text: 'Mengapa manusia dapat berjalan mantap di atas jalan tanpa mudah terpeleset jatuh?',
    type: 'multiple_choice',
    options: ['Karena adanya gaya gesek antara telapak alas kaki dan permukaan tanah', 'Karena gaya gravitasi menarik tubuh kita ke samping', 'Karena tubuh kita mengandung muatan magnet yang kuat', 'Karena ada gaya pegas yang memantulkan telapak kaki'],
    correctAnswer: 0,
    explanation: 'Gaya gesek antara alas sepatu dan jalan memberikan cengkeraman penahan sehingga kita tidak tergelincir.',
    category: 'manfaat_gesek',
    difficulty: 'mudah',
    frictionTag: 'manfaat'
  },
  {
    id: 'mg-2',
    text: 'Ketika sepeda sedang melaju kencang, menekan tuas rem membuat sepeda melambat hingga berhenti. Ini membuktikan bahwa gaya gesek ...',
    type: 'multiple_choice',
    options: ['Merugikan karena merusak ban sepeda', 'Bermanfaat untuk keselamatan mengatur laju kendaraan', 'Hanya berfungsi jika jalan dalam keadaan basah', 'Menghilangkan semua energi gerak secara ajaib'],
    correctAnswer: 1,
    explanation: 'Gaya gesek antara karet rem dan velg roda sangat bermanfaat untuk menghentikan laju sepeda demi keselamatan.',
    category: 'manfaat_gesek',
    difficulty: 'mudah',
    frictionTag: 'manfaat'
  },
  {
    id: 'mg-3',
    text: 'Ban sepeda motor yang sudah dipakai selama 2 tahun terlihat garis-garis alurnya mulai botak dan tipis. Peristiwa ban menjadi aus ini merupakan ...',
    type: 'multiple_choice',
    options: ['Manfaat langsung dari gaya gravitasi', 'Kerugian akibat gaya gesek terus-menerus dengan jalan', 'Manfaat gaya magnet dari aspal jalanan', 'Hasil kerja gaya pegas pada ban'],
    correctAnswer: 1,
    explanation: 'Gesekan terus-menerus antara ban karet dan aspal kasar mengikis karet ban hingga aus (kerugian gaya gesek).',
    category: 'kerugian_gesek',
    difficulty: 'mudah',
    frictionTag: 'kerugian'
  },
  {
    id: 'mg-4',
    text: 'Pernyataan: "Gaya gesek selalu merugikan kehidupan manusia dalam segala hal."',
    type: 'true_false',
    options: ['Benar', 'Salah'],
    correctAnswer: 1,
    explanation: 'Salah! Gaya gesek sangat bermanfaat, seperti membantu kita berjalan tanpa terpeleset, pengereman kendaraan, dan memegang benda.',
    category: 'manfaat_gesek',
    difficulty: 'mudah',
    frictionTag: 'miskonsepsi'
  },
  {
    id: 'mg-5',
    text: 'Saat udara dingin di pegunungan, Siti menggosok-gosokkan kedua telapak tangannya dengan cepat sehingga terasa hangat. Hangat tersebut timbul akibat ...',
    type: 'multiple_choice',
    options: ['Gaya magnet tangan Siti', 'Gaya gesek antara kedua permukaan telapak tangan yang menghasilkan panas', 'Gaya pegas dari kuku jari tangan', 'Gaya gravitasi bumi di puncak gunung'],
    correctAnswer: 1,
    explanation: 'Gesekan antara dua permukaan kulit telapak tangan mengubah energi gerak menjadi energi panas (manfaat gaya gesek).',
    category: 'manfaat_gesek',
    difficulty: 'mudah',
    frictionTag: 'manfaat'
  },
  {
    id: 'mg-6',
    text: 'Pernyataan: "Gaya gesek selalu menguntungkan manusia dan tidak pernah merugikan."',
    type: 'true_false',
    options: ['Benar', 'Salah'],
    correctAnswer: 1,
    explanation: 'Salah! Gaya gesek juga merugikan karena menyebabkan keausan sol sepatu, ban aus, dan membuat mesin panas atau berkarat.',
    category: 'kerugian_gesek',
    difficulty: 'mudah',
    frictionTag: 'miskonsepsi'
  },
  {
    id: 'mg-7',
    text: 'Tukang kayu menggosokkan kertas amplas pada permukaan meja kayu yang kasar hingga menjadi halus dan rata. Hal ini merupakan ...',
    type: 'multiple_choice',
    options: ['Manfaat gaya gesek untuk menghaluskan permukaan benda', 'Kerugian gaya gesek yang merusak kayu', 'Penerapan gaya pegas pada serbuk kayu', 'Contoh gaya magnet antara kertas dan kayu'],
    correctAnswer: 0,
    explanation: 'Gaya gesek butiran amplas mengikis tonjolan kasar pada kayu sehingga menghasilkan permukaan yang rata dan halus.',
    category: 'manfaat_gesek',
    difficulty: 'mudah',
    frictionTag: 'manfaat'
  },
  {
    id: 'mg-8',
    text: 'Engsel pintu kamar berbunyi kencang berdecit kriet-kriet saat dibuka dan terasa berat digerakkan. Peristiwa bunyi berdecit ini merupakan ...',
    type: 'multiple_choice',
    options: ['Manfaat gaya pegas pintu', 'Kerugian akibat gesekan tinggi pada logam engsel yang kering', 'Keuntungan gaya gravitasi ruangan', 'Pengaruh gaya magnet udara'],
    correctAnswer: 1,
    explanation: 'Kurangnya pelumasan membuat gesekan antarlogam engsel tinggi, menimbulkan suara decitan dan hambatan gerak (kerugian gaya gesek).',
    category: 'kerugian_gesek',
    difficulty: 'sedang',
    frictionTag: 'kerugian'
  },
  {
    id: 'mg-9',
    text: 'Gelas kaca yang diletakkan di atas meja makan tidak mudah tergelincir jatuh sendiri saat meja sedikit tersenggol karena adanya ...',
    type: 'multiple_choice',
    options: ['Gaya gesek yang menahan dasar gelas dengan permukaan meja', 'Lem cair tak terlihat di bawah gelas', 'Daya tarik magnet antara kaca dan kayu', 'Kekuatan gaya pegas meja makan'],
    correctAnswer: 0,
    explanation: 'Gaya gesek statis menahan benda tetap di posisinya selama dorongan tidak melebihi gaya gesek penahan.',
    category: 'manfaat_gesek',
    difficulty: 'mudah',
    frictionTag: 'manfaat'
  },
  {
    id: 'mg-10',
    text: 'Pada mesin sepeda motor yang bergerak ribuan kali putaran per menit, gesekan antarbagian logam mesin yang berlebihan dapat mengakibatkan ...',
    type: 'multiple_choice',
    options: ['Bensin motor menjadi berlimpah', 'Mesin cepat panas, komponen aus, dan mesin bisa macet rusak', 'Kecepatan motor melonjak tanpa batas', 'Mesin motor menjadi sedingin es'],
    correctAnswer: 1,
    explanation: 'Gesekan logam tanpa pelumas menimbulkan panas berlebih dan mengikis komponen mesin hingga rusak (kerugian gaya gesek).',
    category: 'kerugian_gesek',
    difficulty: 'sedang',
    frictionTag: 'kerugian'
  },
  {
    id: 'mg-11',
    text: 'Pernyataan: "Apakah gaya gesek menguntungkan atau merugikan itu bergantung pada situasi dan kebutuhan tujuan kita."',
    type: 'true_false',
    options: ['Benar', 'Salah'],
    correctAnswer: 0,
    explanation: 'Benar! Kadang kita butuh gaya gesek besar (seperti rem dan sol sepatu), kadang butuh gaya gesek kecil (seperti pelumas mesin dan roda troli).',
    category: 'manfaat_gesek',
    difficulty: 'mudah',
    frictionTag: 'konsep'
  },
  {
    id: 'mg-12',
    text: 'Ketika kamu memegang pensil saat menulis di buku catatan, pensil tidak melorot lepas dari jemarimu berkat adanya ...',
    type: 'multiple_choice',
    options: ['Gaya magnet antara pensil dan jari', 'Gaya gesek antara kulit jari dan permukaan pensil', 'Gaya pegas dari ujung pensil kayu', 'Gaya gravitasi pensil'],
    correctAnswer: 1,
    explanation: 'Gaya gesek jemari tangan dengan batang pensil memungkinkan kita menggenggam dan mengendalikan pensil dengan mantap.',
    category: 'manfaat_gesek',
    difficulty: 'mudah',
    frictionTag: 'manfaat'
  },
  {
    id: 'mg-13',
    text: 'Korektif Miskonsepsi: Jika di dunia ini sama sekali TIDAK ADA gaya gesek sama sekali, apa yang akan terjadi?',
    type: 'multiple_choice',
    options: ['Semua kendaraan melaju sangat aman dan mudah berhenti', 'Kita tidak bisa berjalan kaki, mobil tergelincir tanpa bisa direm, dan semua benda meluncur jatuh', 'Manusia menjadi lebih kuat mengangkat batu gunung', 'Pakaian kita akan menjadi abadi tanpa pernah rusak'],
    correctAnswer: 1,
    explanation: 'Tanpa gaya gesek sama sekali, kita akan terpeleset terus, kendaraan tidak bisa berhenti, dan kita tidak bisa memegang benda!',
    category: 'manfaat_gesek',
    difficulty: 'sedang',
    frictionTag: 'miskonsepsi'
  },
  {
    id: 'mg-14',
    text: 'Gaya gesek yang terlalu besar saat seseorang mencoba mendorong lemari pakaian yang berat di lantai semen dapat mengakibatkan ...',
    type: 'multiple_choice',
    options: ['Lemari melayang di udara', 'Lemari menjadi sangat sulit digeser dan memerlukan tenaga amat besar', 'Lemari berpindah dengan sangat cepat dan licin', 'Lantai semen berubah menjadi es'],
    correctAnswer: 1,
    explanation: 'Gaya gesek berlebih antara bagian bawah lemari dan lantai kasar menghambat perpindahan benda (kerugian gaya gesek).',
    category: 'kerugian_gesek',
    difficulty: 'mudah',
    frictionTag: 'kerugian'
  },
  {
    id: 'mg-15',
    text: 'Mengapa kapur tulis dapat meninggalkan goresan tulisan putih di papan tulis kayu/hitam?',
    type: 'multiple_choice',
    options: ['Karena gesekan mengikis partikel kapur dan menempelkannya pada papan', 'Karena papan tulis menarik kapur dengan gaya magnet kuat', 'Karena ada reaksi gaya pegas di dalam kapur tulis', 'Karena kapur mencair oleh panas udara'],
    correctAnswer: 0,
    explanation: 'Gesekan antara kapur dan papan tulis mengikis partikel kapur sehingga menempel menjadi huruf dan angka (manfaat gaya gesek).',
    category: 'manfaat_gesek',
    difficulty: 'sedang',
    frictionTag: 'manfaat'
  },

  // ==========================================
  // KATEGORI 6: CARA MEMPERBESAR DAN MEMPERKECIL GAYA GESEK (20 Soal)
  // ==========================================
  {
    id: 'pg-c1',
    text: 'Mengapa bagian bawah sol sepatu lari atau sandal karet dibuat memiliki alur berpola bergerigi?',
    type: 'multiple_choice',
    options: ['Agar sepatu lebih mudah tergelincir saat berlari', 'Untuk memperbesar gaya gesek dengan tanah agar tidak mudah terpeleset', 'Supaya sepatu dapat menarik benda-benda besi di jalan', 'Untuk memperkecil berat badan pelari'],
    correctAnswer: 1,
    explanation: 'Alur berpola pada sol sepatu memperkasar permukaan kontak, memperbesar gaya gesek sehingga pemakai memiliki cengkeraman kokoh.',
    category: 'memperbesar_gesek',
    difficulty: 'mudah',
    frictionTag: 'memperbesar'
  },
  {
    id: 'pg-c2',
    text: 'Engsel pintu rumah terasa kaku dan berbunyi berdecit saat dibuka. Tindakan apa yang paling tepat untuk mengatasinya?',
    type: 'multiple_choice',
    options: ['Menaburkan pasir pantai pada bagian engsel', 'Mengoleskan minyak pelumas atau oli pada engsel', 'Mengikir permukaan engsel dengan amplas kasar', 'Menempelkan magnet pada daun pintu'],
    correctAnswer: 1,
    explanation: 'Minyak pelumas melapisi permukaan logam yang bersentuhan sehingga memperkecil gaya gesek dan gerakannya kembali lancar tanpa suara.',
    category: 'memperkecil_gesek',
    difficulty: 'mudah',
    frictionTag: 'memperkecil'
  },
  {
    id: 'pg-c3',
    text: 'Ayah memasang roda di bagian bawah koper pakaian yang berat. Tujuan pemasangan roda tersebut adalah untuk ...',
    type: 'multiple_choice',
    options: ['Memperkecil gaya gesek sehingga koper mudah ditarik', 'Memperbesar gaya gesek agar koper tidak bergerak', 'Mengurangi berat baju di dalam koper', 'Menghilangkan gaya gravitasi bumi pada koper'],
    correctAnswer: 0,
    explanation: 'Gesekan gelinding roda jauh lebih kecil daripada gesekan seret, sehingga koper berat menjadi sangat ringan dipindahkan.',
    category: 'memperkecil_gesek',
    difficulty: 'mudah',
    frictionTag: 'memperkecil'
  },
  {
    id: 'pg-c4',
    text: 'Mengapa pemain sepak bola memakai sepatu khusus yang memiliki tonjolan-tonjolan paku (pul) di bagian bawah solnya?',
    type: 'multiple_choice',
    options: ['Untuk memperkecil gesekan agar pemain meluncur di rumput', 'Untuk memperbesar gaya gesek agar tidak mudah tergelincir di rumput licin', 'Agar pemain dapat menendang bola lebih tinggi ke awan', 'Untuk mengurangi gaya otot saat berlari'],
    correctAnswer: 1,
    explanation: 'Pul sepatu menancap ke tanah rumput untuk memperbesar cengkeraman/gaya gesek sehingga pemain tidak mudah terpeleset saat bermanuver.',
    category: 'memperbesar_gesek',
    difficulty: 'mudah',
    frictionTag: 'memperbesar'
  },
  {
    id: 'pg-c5',
    text: 'Pernyataan: "Permukaan yang licin selalu lebih baik dan aman untuk segala jenis tempat."',
    type: 'true_false',
    options: ['Benar', 'Salah'],
    correctAnswer: 1,
    explanation: 'Salah! Lantai kamar mandi atau tangga yang terlalu licin sangat berbahaya karena minim gaya gesek dan menyebabkan orang mudah jatuh tergelincir.',
    category: 'memperbesar_gesek',
    difficulty: 'mudah',
    frictionTag: 'miskonsepsi'
  },
  {
    id: 'pg-c6',
    text: 'Pada musim hujan, jalan aspal menjadi basah dan licin. Mengapa ban kendaraan bermotor harus memiliki alur celah (kembangan) yang masih tebal?',
    type: 'multiple_choice',
    options: ['Untuk membuang genangan air sehingga cengkeraman/gaya gesek ban tetap kuat', 'Untuk menyerap air hujan ke dalam ban motor', 'Agar ban motor meluncur seperti papan ski es', 'Untuk memperkecil bunyi mesin motor'],
    correctAnswer: 0,
    explanation: 'Alur kembangan ban berfungsi mengalirkan air keluar sehingga karet ban tetap bersentuhan langsung dengan aspal, mempertahankan gaya gesek.',
    category: 'memperbesar_gesek',
    difficulty: 'sedang',
    frictionTag: 'memperbesar'
  },
  {
    id: 'pg-c7',
    text: 'Atlet senam lantai atau atlet panjat tebing sering mengusapkan serbuk kapur putih (magnesium) ke telapak tangan sebelum bertanding. Tindakan ini bertujuan untuk ...',
    type: 'multiple_choice',
    options: ['Menyerap keringat dan memperbesar gaya gesek genggaman', 'Membuat telapak tangan menjadi sangat licin seperti sutra', 'Mendinginkan udara di sekitar arena lomba', 'Mengubah berat badan atlet'],
    correctAnswer: 0,
    explanation: 'Serbuk kapur menyerap keringat yang licin dan membuat permukaan kulit lebih kesat, memperbesar gaya gesek genggaman agar tidak jatuh.',
    category: 'memperbesar_gesek',
    difficulty: 'sedang',
    frictionTag: 'memperbesar'
  },
  {
    id: 'pg-c8',
    text: 'Pernyataan: "Gaya gesek harus selalu diperkecil pada setiap benda tanpa pengecualian."',
    type: 'true_false',
    options: ['Benar', 'Salah'],
    correctAnswer: 1,
    explanation: 'Salah! Pada sistem rem, ban, dan alas sepatu, gaya gesek JUSTRU harus memadai dan besar demi cengkeraman dan keselamatan kita.',
    category: 'memperkecil_gesek',
    difficulty: 'mudah',
    frictionTag: 'miskonsepsi'
  },
  {
    id: 'pg-c9',
    text: 'Rantai sepeda Andi berkarat dan terasa sangat berat saat dikayuh. Apa yang harus dilakukan Andi agar sepedanya kembali ringan dan lancar?',
    type: 'multiple_choice',
    options: ['Membersihkan rantai dan mengoleskan minyak pelumas oli rantai', 'Menaburkan tepung terigu ke seluruh rantai sepeda', 'Menggosok rantai dengan amplas sampai patah', 'Menyiram rantai dengan air garam setiap pagi'],
    correctAnswer: 0,
    explanation: 'Minyak pelumas rantai mengurangi gesekan antarmata rantai dengan gir logam sehingga kayuhan menjadi ringan dan lancar.',
    category: 'memperkecil_gesek',
    difficulty: 'mudah',
    frictionTag: 'memperkecil'
  },
  {
    id: 'pg-c10',
    text: 'Pernyataan: "Gaya gesek harus selalu diperbesar pada semua bagian mesin motor."',
    type: 'true_false',
    options: ['Benar', 'Salah'],
    correctAnswer: 1,
    explanation: 'Salah! Di dalam ruang mesin, gesekan justru harus diperkecil memakai oli mesin agar piston dan suku cadang tidak aus dan rusak.',
    category: 'memperkecil_gesek',
    difficulty: 'mudah',
    frictionTag: 'miskonsepsi'
  },
  {
    id: 'pg-c11',
    text: 'Budi kesulitan memindahkan peti kayu besar yang berat di atas lantai semen. Cara manakah yang paling efektif MEMPERKECIL gaya gesek agar peti mudah dipindahkan?',
    type: 'multiple_choice',
    options: ['Meletakkan pipa bulat atau troli beroda di bawah peti kayu', 'Menyeret peti dengan tali kecil tanpa bantuan alat', 'Membuat permukaan lantai menjadi lebih kasar berlubang', 'Menaburkan semen kering di lantai'],
    correctAnswer: 0,
    explanation: 'Menggunakan rol pipa gelinding atau roda troli mengubah gaya gesek geser menjadi gaya gesek putar yang jauh lebih kecil.',
    category: 'memperkecil_gesek',
    difficulty: 'sedang',
    frictionTag: 'memperkecil'
  },
  {
    id: 'pg-c12',
    text: 'Mengapa tangga darurat di gedung bertingkat sering dipasangi plester karet bergaris kasar di setiap tepi anak tangganya?',
    type: 'multiple_choice',
    options: ['Untuk mempercantik warna tangga saja', 'Untuk memperbesar gaya gesek agar orang yang lewat tidak mudah tergelincir', 'Untuk mempercepat orang meluncur turun tangga', 'Untuk memperkecil bunyi langkah kaki'],
    correctAnswer: 1,
    explanation: 'Plester karet kasar meningkatkan gaya gesek antara sol sepatu dan tepi tangga, mencegah bahaya jatuh tergelincir.',
    category: 'memperbesar_gesek',
    difficulty: 'mudah',
    frictionTag: 'memperbesar'
  },
  {
    id: 'pg-c13',
    text: 'Di arena bermain seluncuran anak (perosotan), permukaan lintasannya dibuat sangat mulus dan licin. Hal ini bertujuan untuk ...',
    type: 'multiple_choice',
    options: ['Memperkecil gaya gesek agar anak dapat meluncur dengan lancar dan gembira', 'Memperbesar gaya gesek agar anak berhenti di tengah seluncuran', 'Menahan berat anak agar tidak jatuh ke bawah', 'Mengurangi kecepatan luncur anak'],
    correctAnswer: 0,
    explanation: 'Permukaan seluncuran yang mulus memperkecil gaya gesek sehingga anak dapat meluncur dengan lancar dan nyaman.',
    category: 'memperkecil_gesek',
    difficulty: 'mudah',
    frictionTag: 'memperkecil'
  },
  {
    id: 'pg-c14',
    text: 'Pernyataan: "Menghaluskan dua permukaan yang bersentuhan adalah salah satu cara untuk memperkecil gaya gesek."',
    type: 'true_false',
    options: ['Benar', 'Salah'],
    correctAnswer: 0,
    explanation: 'Benar! Semakin halus dan rata permukaan yang saling bersentuhan, hambatan gerak (gaya gesek) umumnya akan semakin kecil.',
    category: 'memperkecil_gesek',
    difficulty: 'mudah',
    frictionTag: 'memperkecil'
  },
  {
    id: 'pg-c15',
    text: 'Mengapa pegangan setang sepeda atau raket bulu tangkis dilapisi pita karet bertekstur?',
    type: 'multiple_choice',
    options: ['Agar tangan mudah terlepas saat bermain', 'Untuk memperbesar gaya gesek sehingga genggaman tangan tidak licin', 'Supaya raket menjadi magnet yang menarik shuttlecock', 'Untuk membuat raket memantul di udara'],
    correctAnswer: 1,
    explanation: 'Grip karet bertekstur memperbesar gaya gesek tangan pada pegangan raket/setang, menjaga genggaman tetap kuat walau tangan berkeringat.',
    category: 'memperbesar_gesek',
    difficulty: 'mudah',
    frictionTag: 'memperbesar'
  },
  {
    id: 'pg-c16',
    text: 'Pada bantalan poros roda sepeda motor dan kipas angin terdapat bola-bola baja kecil yang disebut "bearing" (laher/pelor). Fungsi bantalan bola tersebut adalah ...',
    type: 'multiple_choice',
    options: ['Memperkecil gesekan poros sehingga putaran roda menjadi sangat lancar', 'Memperbesar gesekan poros agar roda cepat berhenti', 'Menyerap aliran listrik di dalam dinamo', 'Membuat suara motor menjadi lebih keras'],
    correctAnswer: 0,
    explanation: 'Bearing (bantalan pelor) menggantikan gesekan seret menjadi putaran bola-bola halus, sangat memperkecil gaya gesek poros.',
    category: 'memperkecil_gesek',
    difficulty: 'sulit',
    frictionTag: 'memperkecil'
  },
  {
    id: 'pg-c17',
    text: 'Ketika mobil terjebak di jalan tanah berlumpur yang sangat licin sehingga rodanya berputar di tempat (slip), tindakan sopir yang tepat adalah ...',
    type: 'multiple_choice',
    options: ['Menyiram lumpur dengan minyak goreng', 'Menyelipkan ranting kayu atau papan di bawah ban untuk memperbesar gesekan', 'Menghaluskan ban mobil dengan sabun cair', 'Mendorong mobil ke tempat yang lebih berlumpur'],
    correctAnswer: 1,
    explanation: 'Menyelipkan ranting, papan, atau pasir di bawah ban memberikan permukaan kasar yang memperbesar gaya gesek sehingga ban mendapatkan cengkeraman maju.',
    category: 'memperbesar_gesek',
    difficulty: 'sedang',
    frictionTag: 'memperbesar'
  },
  {
    id: 'pg-c18',
    text: 'Pernyataan: "Mengoleskan lilin atau sabun pada resleting tas yang macet dapat membantu memperkecil gaya gesek sehingga resleting kembali lancar."',
    type: 'true_false',
    options: ['Benar', 'Salah'],
    correctAnswer: 0,
    explanation: 'Benar! Lilin atau sabun berfungsi sebagai pelumas padat yang menghaluskan sentuhan gigi resleting, memperkecil gaya gesek.',
    category: 'memperkecil_gesek',
    difficulty: 'sedang',
    frictionTag: 'memperkecil'
  },
  {
    id: 'pg-c19',
    text: 'Mengapa papan karambol sering ditaburi bubuk talk/kristal halus sebelum dimainkan?',
    type: 'multiple_choice',
    options: ['Untuk memperkecil gaya gesek agar koin karambol meluncur cepat dan jauh', 'Untuk memperbesar gaya gesek agar koin tidak bisa bergerak', 'Untuk menempelkan koin karambol di papan', 'Agar koin karambol tidak bersuara'],
    correctAnswer: 0,
    explanation: 'Serbuk halus membuat permukaan papan karambol licin, memperkecil gaya gesek sehingga koin meluncur lancar saat disentil.',
    category: 'memperkecil_gesek',
    difficulty: 'sedang',
    frictionTag: 'memperkecil'
  },
  {
    id: 'pg-c20',
    text: 'Korektif Miskonsepsi: Apakah permukaan yang KASAR selalu lebih menguntungkan dibanding permukaan yang LICIN?',
    type: 'multiple_choice',
    options: ['Ya, permukaan kasar selalu memberikan hasil terbaik di setiap keadaan', 'Tidak, tergantung fungsi! Kasar bagus untuk sol sepatu, tetapi licin bagus untuk poros mesin dan seluncuran', 'Ya, karena permukaan licin selalu merugikan manusia', 'Tidak, permukaan kasar tidak pernah dibutuhkan sama sekali'],
    correctAnswer: 1,
    explanation: 'Kondisi permukaan harus disesuaikan dengan kebutuhan. Kita butuh kasar untuk rem dan pijakan, tapi butuh licin/berpelumas untuk bagian mesin yang berputar.',
    category: 'memperbesar_gesek',
    difficulty: 'sedang',
    frictionTag: 'miskonsepsi'
  }
];

export const CATEGORY_LABELS: Record<string, string> = {
  pengertian_pengaruh: 'Pengertian & Pengaruh Gaya',
  gaya_otot: 'Gaya Otot',
  gaya_pegas: 'Gaya Pegas',
  gaya_magnet: 'Gaya Magnet',
  manfaat_gesek: 'Manfaat Gaya Gesek',
  kerugian_gesek: 'Kerugian Gaya Gesek',
  memperbesar_gesek: 'Cara Memperbesar Gaya Gesek',
  memperkecil_gesek: 'Cara Memperkecil Gaya Gesek',
  miskonsepsi: 'Pelurusan Miskonsepsi Gaya'
};
