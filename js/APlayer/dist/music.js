const ap = new APlayer({
    container: document.getElementById('aplayer'),
    // mini: false,
    // autoplay: false,
    // theme: '#FADFA3',
    // loop: 'all',
    // order: 'random',
    // preload: 'auto',
    // volume: 0.7,
    // mutex: true,
    //listFolded: false,
    //listMaxHeight: 90,
    //lrcType: 3,
    // lrcType: false,
    theme: '#e9e9e9',
    fixed: true,
    audio: [
      {
        name: "初雪",
        artist: 'AirS1991',
        url: '/static/music/邱有句,AirS1991 - 初雪.mp3',
        cover: 'https://p2.music.126.net/Q_mm2I-F1e1PFP4xfDVAvw==/18415720254126874.jpg',
        // lrc: 'https://cn-south-17-aplayer-46154810.oss.dogecdn.com/yourname.lrc',
        // theme: '#ebd0c2'
      },
      {
        name: '花火の夜に',
        artist: '羽岡佳',
        url: '/static/music/羽岡佳 - 花火の夜に.mp3',
        cover: 'https://p1.music.126.net/ywdJER2rqooVWG2MEn_lMA==/109951163351715219.jpg',
        // theme: '#ebd0c2'
      },
      {
        name: 'Into The Rain',
        artist: 'East Root',
        url: '/static/music/East Root - Into The Rain.mp3',
        cover: 'https://p1.music.126.net/dXXyIuK4rx8IJOfmVzH9EA==/5515150325044954.jpg',
        // theme: '#46718b'
      },
      {
        name: '비오는 밤',
        artist: 'Donawhale',
        url: '/static/music/Donawhale.mp3',
        cover: 'https://p2.music.126.net/zr3iQM2ToVmYnJ61R_Anow==/737772302242099.jpg',
        // theme: '#505d6b'
      },
      {
        name: 'Moment of Peace',
        artist: 'Gregorian Chants',
        url: '/static/music/Gregorian Chants - Moment of Peace.mp3',
        cover: 'https://p1.music.126.net/V6OeGlYJO-RypzSoSeENHQ==/6655343883648864.jpg',
        // theme: '#e9e9e9'
      },
      {
        name: 'Farewell（Piano Solo）',
        artist: '十指流玉',
        url: '/static/music/十指流玉 - Farewell.mp3',
        cover: 'https://p2.music.126.net/v1M6jiViVY8hGIck5o2HAg==/109951162977569489.jpg',
        // theme: '#46718b'
      },
      {
        name: '夜的钢琴曲五',
        artist: '石进',
        url: '/static/music/夜的钢琴曲五.mp3',
        cover: 'https://p1.music.126.net/hNJFmhHzaGxYYwVbQbALNw==/79164837215733.jpg',
        // theme: '#505d6b'
      },
      {
        name: 'Jamie & Landon',
        artist: 'Painless Destiny',
        url: '/static/music/Painless Destiny - Jamie & Landon.mp3',
        cover: 'https://p2.music.126.net/v9nlmMJFXrPaVg7cjUwY8g==/6068204674264846.jpg',
      },
      {
        name: 'Kiss The Rain 비를 맞다',
        artist: 'Yiruma',
        url: '/static/music/Yiruma - Kiss The Rain.mp3',
        cover: 'https://p2.music.126.net/J1Y7Lyh-xq5Q8ht5z6dlWg==/18337654928625506.jpg',
      },
      {
        name: 'Tennessee',
        artist: 'Hans Zimmer',
        url: '/static/music/Hans Zimmer - Tennessee.mp3',
        cover: 'hhttps://p1.music.126.net/Pd95wG1mfWEkNy-nbN6WSw==/1681153278869513.jpg',
      },
      {
        name: '蝶恋',
        artist: '李维',
        url: 'h/static/music/李维 - 蝶恋.mp3',
        cover: 'https://p2.music.126.net/FqFvn-Q4LWQEQbccV7dZqQ==/109951163243423222.jpg',
      },
      {
        name: 'I have never been to me',
        artist: 'Sweet Hearts',
        url: '/static/music/Sweet Hearts - I have never been to me.mp3',
        cover: 'https://p1.music.126.net/z6cm4THprFZkcU80H6fYbQ==/721279627864466.jpg',
      },
      {
        name: '三个人的时光',
        artist: '吴欣睿',
        url: '/static/music/吴欣睿 - 三个人的时光.mp3',
        cover: 'https://p1.music.126.net/vQYQMovfEtuGNCqndIUm4A==/50577534878590.jpg',
      },
      {
        name: '沉醉于风中',
        artist: 'S.E.N.S.',
        url: 'h/static/music/S.E.N.S. - 沉醉于风中.mp3',
        cover: 'https://p1.music.126.net/elZ9AHknD-31eA5MnSPr4Q==/661905999933241.jpg',
      },
      {
        name: 'You Are My Angel',
        artist: 'Painless Destiny',
        url: '/static/music/Painless Destiny - You Are My Angel.mp3',
        cover: 'https://p1.music.126.net/9etm6ppsoBe0_jSsCsAnrw==/109951163535659811.jpg',
      }
    ]
});
// const colorThief = new ColorThief();
// const setTheme = (index) => {
//     if (!ap.list.audios[index].theme) {
//         colorThief.getColorAsync(ap.list.audios[index].cover, function (color) {
//             ap.theme(`rgb(${color[0]}, ${color[1]}, ${color[2]})`, index);
//         });
//     }
// };
// setTheme(ap.list.index);
// ap.on('listswitch', (index) => {
//     setTheme(index);
// });