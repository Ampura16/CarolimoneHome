/**
 * Mineplex 粉丝复刻站 · 轻量 i18n 引擎
 * - 词典内嵌（不依赖 fetch，file:// 与沙箱预览均可工作）
 * - 文案键使用路径语法：data-i18n="nav.home"
 * - 语言持久化：localStorage('mplang')，默认跟随浏览器语言
 */
(function (global) {
  'use strict';

  var DICT = {
    en: {
      'meta.title.home': 'Mineplex — Minecraft Minigame Server',
      'meta.title.games': 'Games — Mineplex',
      'meta.title.news': 'News — Mineplex',

      'topbar.players': 'PLAYERS ONLINE',
      'topbar.install': 'Install the app',

      'nav.home': 'Home',
      'nav.games': 'Games',
      'nav.news': 'News',
      'nav.play': 'How to Play',
      'nav.shop': 'Shop',
      'nav.support': 'Support',
      'nav.login': 'Log in',
      'nav.register': 'Register',
      'nav.menu': 'Menu',

      'hero.welcome': 'Welcome to Mineplex',
      'hero.subtitle': 'Mineplex is home to several awesome Minecraft minigames, featuring The Bridges, Clans, Survival Games, Super Smash Mobs and many more!',
      'hero.play_now': 'Play Now!',
      'hero.copy_ip': 'Copy IP',
      'hero.ip_copied': 'Server IP copied to clipboard!',
      'hero.server': 'Server IP',

      'news.title': 'Latest news',
      'news.view_all': 'View all news',
      'news.read_more': 'Read more',
      'news.tag.official': 'Official',
      'news.tag.newgame': 'New Game',
      'news.tag.update': 'Game Update',
      'news.items.lobby.title': 'The New Mineplex Lobby',
      'news.items.lobby.date': 'Nov 9, 2026',
      'news.items.lobby.excerpt': 'Step into our brand-new lobby — faster travel, fresh secrets and a cozy new look for the community hub.',
      'news.items.restaurant.title': 'Restaurant Rush: Opening November 14!',
      'news.items.restaurant.date': 'Nov 7, 2026',
      'news.items.restaurant.excerpt': 'A brand-new cooking chaos game arrives this week. Seat guests, flip orders and keep the kitchen alive!',
      'news.items.ssm.title': 'Super Smash Mobs: Remastered',
      'news.items.ssm.date': 'Oct 30, 2026',
      'news.items.ssm.excerpt': 'The classic mob brawler returns remastered — reworked kits, new maps and smoother combat.',
      'news.items.halloween.title': 'Halloween Bundle & Double XP Weekend',
      'news.items.halloween.date': 'Oct 27, 2026',
      'news.items.halloween.excerpt': 'Grab the spooky Halloween bundle and earn double XP all weekend long across every game.',

      'games.title': 'Try out our games!',
      'games.subtitle': 'Check out one of our 17 games! Prepare for hours of fun alone or with your friends! Tap a game to find out more.',
      'games.view_all': 'View all games',
      'games.modal.play': 'Play this game',
      'games.modal.close': 'Close',
      'games.items.bridges.name': 'The Bridges',
      'games.items.bridges.desc': 'Teams fortify their islands, then clash across bridges once the walls drop. Last team standing wins.',
      'games.items.champions.name': 'Champions',
      'games.items.champions.desc': 'Build your own class from unique skills and dominate objective-based arena battles.',
      'games.items.survival-games.name': 'Survival Games',
      'games.items.survival-games.desc': '24 tributes, one victor. Loot chests, craft gear and outlast everyone in the arena.',
      'games.items.cake-wars.name': 'Cake Wars',
      'games.items.cake-wars.desc': 'Protect your cake, eat the enemies’! Once a team’s cake is gone, its players stop respawning.',
      'games.items.nano-games.name': 'Nano Games',
      'games.items.nano-games.desc': 'A rapid-fire rotation of bite-sized challenges — earn points round after round to top the podium.',
      'games.items.mixed-arcade.name': 'Mixed Arcade',
      'games.items.mixed-arcade.desc': 'A shuffled playlist of classic Mineplex arcade games. Something new every round.',
      'games.items.turf-wars.name': 'Turf Wars',
      'games.items.turf-wars.desc': 'Two teams, bows only. Push the line into enemy turf arrow by arrow until their base falls.',
      'games.items.paintball.name': 'Paintball',
      'games.items.paintball.desc': 'Fast-paced team paintball — splatter your opponents before they splatter you.',
      'games.items.micro-battle.name': 'Micro Battle',
      'games.items.micro-battle.desc': 'Small maps, short rounds, instant action. Squad up and wipe the enemy team.',
      'games.items.dragon-escape.name': 'Dragon Escape',
      'games.items.dragon-escape.desc': 'A furious dragon is wrecking the park behind you — parkour to the finish before it catches up!',
      'games.items.super-smash-mobs.name': 'Super Smash Mobs',
      'games.items.super-smash-mobs.desc': 'Pick a mob with custom abilities and knock your rivals off the stage, brawler style.',
      'games.items.minestrike.name': 'Minestrike',
      'games.items.minestrike.desc': 'Tactical bomb-defusal rounds inspired by classic shooters — buy phase, plant, defuse.',
      'games.items.block-hunt.name': 'Block Hunt',
      'games.items.block-hunt.desc': 'Hiders disguise as blocks and blend into the map; hunters must sniff them out.',
      'games.items.clans.name': 'Clans',
      'games.items.clans.desc': 'A persistent open-world war — build a base, form a clan and raid your enemies.',
      'games.items.mps.name': 'MPS',
      'games.items.mps.desc': 'Mineplex Player Servers: spin up your own server and play Mineplex games with your rules.',
      'games.items.one-block.name': 'One Block',
      'games.items.one-block.desc': 'Start on a single regenerating block and grow it into a whole sky island world.',
      'games.items.castle-siege.name': 'Castle Siege',
      'games.items.castle-siege.desc': 'Defenders hold the keep, attackers storm the gates. A massive medieval siege.',

      'play.title': 'Play Mineplex Now!',
      'play.subtitle': 'Choose the Minecraft version you want to play on',
      'play.tab.java': 'Java Edition',
      'play.tab.bedrock': 'Bedrock Edition',
      'play.tab.console': 'Console',
      'play.java.h': 'How to play on Java Edition',
      'play.java.s0': 'Open the latest version of Minecraft Java',
      'play.java.s1': 'Click Multiplayer',
      'play.java.s2': 'Press Add Server',
      'play.java.s3': 'For server name, put whatever you want',
      'play.java.s4': 'For server address, write play.mineplex.com',
      'play.java.s5': 'For server resource packs, click until it says Enabled',
      'play.java.s6': 'Click Done',
      'play.java.s7': 'Press on Mineplex',
      'play.java.s8': 'Click Join Server',
      'play.java.s9': 'Have fun!',
      'play.bedrock.h': 'How to play on Bedrock Edition',
      'play.bedrock.s0': 'Open the latest version of Minecraft Bedrock',
      'play.bedrock.s1': 'Press Play',
      'play.bedrock.s2': 'Sign in if you aren’t already',
      'play.bedrock.s3': 'Click Creator Multiplayer on the top right',
      'play.bedrock.s4': 'Press Add server on the top left',
      'play.bedrock.s5': 'For server name, put whatever you want',
      'play.bedrock.s6': 'For server address, write play.mineplex.com',
      'play.bedrock.s7': 'Keep port the same: 19132',
      'play.bedrock.s8': 'Click Add and play',
      'play.bedrock.s9': 'Have fun!',
      'play.console.h': 'How to play on Console',
      'play.console.s0': 'Make sure your console is signed in to a Microsoft (Xbox) account',
      'play.console.s1': 'Open Minecraft, click Play, then open the Friends tab',
      'play.console.s2': 'Click Add Friend, search for JoinMineplex, and add them',
      'play.console.s3': 'JoinMineplex is always online on Mineplex and will appear under Joinable Friends',
      'play.console.s4': 'Select JoinMineplex to join the server',
      'play.console.s5': 'Have fun!',

      'footer.about': 'Home to several awesome Minecraft minigames since 2013.',
      'footer.links': 'Links',
      'footer.community': 'Community',
      'footer.legal': 'Legal',
      'footer.rules': 'Rules',
      'footer.faq': 'FAQ',
      'footer.staff': 'Staff List',
      'footer.events': 'Events',
      'footer.tos': 'Terms of Service',
      'footer.privacy': 'Privacy',
      'footer.disclaimer': 'Unofficial fan-made clone for learning purposes. Not affiliated with Mineplex or Mojang.',
      'footer.back_top': 'Back to top',

      'lang.label': '中文'
    },

    'zh-CN': {
      'meta.title.home': 'Mineplex — Minecraft 小游戏服务器',
      'meta.title.games': '游戏一览 — Mineplex',
      'meta.title.news': '新闻中心 — Mineplex',

      'topbar.players': '名玩家在线',
      'topbar.install': '安装应用',

      'nav.home': '首页',
      'nav.games': '游戏',
      'nav.news': '新闻',
      'nav.play': '玩法指南',
      'nav.shop': '商店',
      'nav.support': '支持',
      'nav.login': '登录',
      'nav.register': '注册',
      'nav.menu': '菜单',

      'hero.welcome': '欢迎来到 Mineplex',
      'hero.subtitle': 'Mineplex 汇集了众多精彩的 Minecraft 小游戏，包括 Bridges、Clans、生存游戏、超级怪物大乱斗等等！',
      'hero.play_now': '立即游玩！',
      'hero.copy_ip': '复制 IP',
      'hero.ip_copied': '服务器 IP 已复制到剪贴板！',
      'hero.server': '服务器地址',

      'news.title': '最新新闻',
      'news.view_all': '查看全部新闻',
      'news.read_more': '阅读全文',
      'news.tag.official': '官方',
      'news.tag.newgame': '新游戏',
      'news.tag.update': '游戏更新',
      'news.items.lobby.title': '全新的 Mineplex 大厅',
      'news.items.lobby.date': '2026 年 11 月 9 日',
      'news.items.lobby.excerpt': '走进我们全新的大厅——传送更快、彩蛋更多，社区中心焕然一新。',
      'news.items.restaurant.title': '餐厅冲冲冲：11 月 14 日开业！',
      'news.items.restaurant.date': '2026 年 11 月 7 日',
      'news.items.restaurant.excerpt': '全新烹饪混战游戏本周上线。招呼客人、翻炒订单，让餐厅火力全开！',
      'news.items.ssm.title': '超级怪物大乱斗：重制版',
      'news.items.ssm.date': '2026 年 10 月 30 日',
      'news.items.ssm.excerpt': '经典怪物乱斗重制归来——重做技能、新地图和更顺滑的对战体验。',
      'news.items.halloween.title': '万圣节礼包与双倍经验周末',
      'news.items.halloween.date': '2026 年 10 月 27 日',
      'news.items.halloween.excerpt': '入手万圣节限定礼包，整个周末在所有游戏中享受双倍经验。',

      'games.title': '试试我们的游戏！',
      'games.subtitle': '来看看我们的 17 款游戏！无论独自游玩还是与朋友同乐，都能畅玩数小时！点击游戏查看详情。',
      'games.view_all': '查看全部游戏',
      'games.modal.play': '游玩此游戏',
      'games.modal.close': '关闭',
      'games.items.bridges.name': '桥梁攻防战',
      'games.items.bridges.desc': '各队先在岛上备战，护墙落下后通过桥梁互相进攻，站到最后即获胜。',
      'games.items.champions.name': '英雄争霸',
      'games.items.champions.desc': '用独特技能自由搭配职业，在目标驱动的竞技场对战中称霸。',
      'games.items.survival-games.name': '生存游戏',
      'games.items.survival-games.desc': '24 名玩家只有 1 名胜者。搜刮宝箱、打造装备，在竞技场中活到最后。',
      'games.items.cake-wars.name': '蛋糕战争',
      'games.items.cake-wars.desc': '保护己方蛋糕、吃掉敌方蛋糕！蛋糕消失后，该队玩家将无法复活。',
      'games.items.nano-games.name': '纳米游戏',
      'games.items.nano-games.desc': '快节奏轮换的超小型挑战——逐轮得分，冲击领奖台。',
      'games.items.mixed-arcade.name': '混合街机',
      'games.items.mixed-arcade.desc': '经典街机游戏随机轮换播放列表，每轮都有新花样。',
      'games.items.turf-wars.name': '领地拉锯战',
      'games.items.turf-wars.desc': '两队只用弓箭对抗，一箭一箭把战线推入敌方领地直至攻破基地。',
      'games.items.paintball.name': '彩弹射击',
      'games.items.paintball.desc': '快节奏团队彩弹对战——在对手把你染成花脸之前先下手为强。',
      'games.items.micro-battle.name': '微型战斗',
      'games.items.micro-battle.desc': '小地图、短回合、随时开战。组好小队，歼灭敌方全队。',
      'games.items.dragon-escape.name': '逃离巨龙',
      'games.items.dragon-escape.desc': '暴怒的巨龙正在身后摧毁公园——跑酷冲向终点，别被它追上！',
      'games.items.super-smash-mobs.name': '超级怪物大乱斗',
      'games.items.super-smash-mobs.desc': '选择拥有专属技能的怪物，把对手击飞出擂台，赢下这份乱斗荣耀。',
      'games.items.minestrike.name': '矿井突击',
      'games.items.minestrike.desc': '致敬经典射击游戏的战术爆破回合——购买装备、安放炸弹、拆除炸弹。',
      'games.items.block-hunt.name': '方块捉迷藏',
      'games.items.block-hunt.desc': '躲藏者伪装成方块融入地图，猎手必须把她们一个个揪出来。',
      'games.items.clans.name': '部落战争',
      'games.items.clans.desc': '持久开放世界战争——建造基地、组建部落并突袭你的敌人。',
      'games.items.mps.name': 'MPS 玩家服务器',
      'games.items.mps.desc': 'Mineplex 玩家自建服务器：一键开设你自己的服务器，按你的规则游玩。',
      'games.items.one-block.name': '单方块世界',
      'games.items.one-block.desc': '从一个会无限再生的方块开始，把它发展成一整座空岛世界。',
      'games.items.castle-siege.name': '城堡攻防',
      'games.items.castle-siege.desc': '守方固守主堡，攻方猛攻城门。一场宏大的中世纪攻城战。',

      'play.title': '现在就玩 Mineplex！',
      'play.subtitle': '选择你要游玩的 Minecraft 版本',
      'play.tab.java': 'Java 版',
      'play.tab.bedrock': '基岩版',
      'play.tab.console': '主机版',
      'play.java.h': 'Java 版游玩方法',
      'play.java.s0': '打开最新版本的 Minecraft Java 版',
      'play.java.s1': '点击【多人游戏】',
      'play.java.s2': '点击【添加服务器】',
      'play.java.s3': '服务器名称随意填写',
      'play.java.s4': '服务器地址填写 play.mineplex.com',
      'play.java.s5': '服务器资源包选项点到【启用】',
      'play.java.s6': '点击【完成】',
      'play.java.s7': '选中 Mineplex',
      'play.java.s8': '点击【加入服务器】',
      'play.java.s9': '玩得开心！',
      'play.bedrock.h': '基岩版游玩方法',
      'play.bedrock.s0': '打开最新版本的 Minecraft 基岩版',
      'play.bedrock.s1': '点击【游玩】',
      'play.bedrock.s2': '如未登录请先登录',
      'play.bedrock.s3': '点击右上角【创作者多人游戏】',
      'play.bedrock.s4': '点击左上角【添加服务器】',
      'play.bedrock.s5': '服务器名称随意填写',
      'play.bedrock.s6': '服务器地址填写 play.mineplex.com',
      'play.bedrock.s7': '端口保持默认：19132',
      'play.bedrock.s8': '点击【添加并游玩】',
      'play.bedrock.s9': '玩得开心！',
      'play.console.h': '主机版游玩方法',
      'play.console.s0': '确保主机已登录 Microsoft（Xbox）账号',
      'play.console.s1': '打开 Minecraft，点击【游玩】，然后打开【好友】标签页',
      'play.console.s2': '点击【添加好友】，搜索 JoinMineplex 并添加',
      'play.console.s3': 'JoinMineplex 长期在线，会显示在【可加入的好友】中',
      'play.console.s4': '选择 JoinMineplex 即可加入服务器',
      'play.console.s5': '玩得开心！',

      'footer.about': '自 2013 年起，汇聚众多精彩 Minecraft 小游戏。',
      'footer.links': '站内链接',
      'footer.community': '社区',
      'footer.legal': '法律条款',
      'footer.rules': '规则',
      'footer.faq': '常见问题',
      'footer.staff': '管理团队',
      'footer.events': '活动',
      'footer.tos': '服务条款',
      'footer.privacy': '隐私政策',
      'footer.disclaimer': '非官方粉丝复刻作品，仅用于学习交流。与 Mineplex 或 Mojang 无任何隶属关系。',
      'footer.back_top': '回到顶部',

      'lang.label': 'English'
    }
  };

  var STORAGE_KEY = 'mplang';

  function resolve(lang, path) {
    var langDict = DICT[lang];
    if (!langDict) return undefined;
    // 词典为扁平键（如 'nav.home'），优先整键命中
    if (Object.prototype.hasOwnProperty.call(langDict, path)) return langDict[path];
    // 兼容嵌套对象查找
    var node = langDict;
    var parts = path.split('.');
    for (var i = 0; i < parts.length; i++) {
      if (node == null) return undefined;
      node = node[parts[i]];
    }
    return node;
  }

  function t(path) {
    var lang = I18N.lang;
    var v = resolve(lang, path);
    if (v === undefined && lang !== 'en') v = resolve('en', path);
    return (v === undefined) ? path : v;
  }

  function apply(root) {
    root = root || document;
    var nodes = root.querySelectorAll('[data-i18n]');
    nodes.forEach(function (el) {
      var v = t(el.getAttribute('data-i18n'));
      if (typeof v === 'string') el.textContent = v;
    });
    var titles = root.querySelectorAll('[data-i18n-title]');
    titles.forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-title'));
      if (typeof v === 'string') el.setAttribute('title', v);
    });
  }

  var I18N = {
    lang: 'en',
    dict: DICT,
    t: t,
    apply: apply,
    setLang: function (lang, persist) {
      if (!DICT[lang]) lang = 'en';
      I18N.lang = lang;
      document.documentElement.setAttribute('lang', lang);
      apply(document);
      if (persist !== false) {
        try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
      }
      document.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang: lang } }));
    },
    toggle: function () {
      I18N.setLang(I18N.lang === 'en' ? 'zh-CN' : 'en');
    },
    detect: function () {
      var saved = null;
      try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* ignore */ }
      if (saved && DICT[saved]) return saved;
      var nav = (navigator.language || 'en').toLowerCase();
      return nav.indexOf('zh') === 0 ? 'zh-CN' : 'en';
    },
    init: function () {
      I18N.setLang(I18N.detect(), false);
    }
  };

  global.I18N = I18N;
})(window);
