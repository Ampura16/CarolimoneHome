#!/usr/bin/env bash
# BlockLand Minigames素材抓取脚本：从 mineplex.com 源站本地化图片素材
# 用法：bash tools/fetch_assets.sh
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1
B="https://mineplex.com"
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
mkdir -p assets/img/hero assets/img/games assets/img/news assets/img/ui

dl() { curl -fsSL "$1" -A "$UA" -o "$2" --max-time 90 && echo "OK   $2" || echo "FAIL $2"; }

# --- Hero 视差层 ---
for i in 0 1 2 3 4 5; do
  dl "$B/data/assets/mineplex/xf_header_layer$i.png" "assets/img/hero/layer$i.png"
done

# --- UI 素材 ---
dl "$B/data/assets/mineplex/body-pattern.png" "assets/img/ui/body-pattern.png"
dl "$B/styles/default/mineplex/mp-modern-favicon.png" "assets/img/ui/favicon.png"
dl "$B/data/assets/mineplex/play/img/playnow/illustrations/play_mineplex_1.png" "assets/img/ui/play_java.png"
dl "$B/data/assets/mineplex/play/img/playnow/illustrations/play_mineplex_2.png" "assets/img/ui/play_bedrock.png"

# --- 17 款游戏图标 ---
dl "$B/data/mineplex/Games/the-bridges.png" "assets/img/games/the-bridges.png"
dl "$B/data/mineplex/Games/champions.png" "assets/img/games/champions.png"
dl "$B/data/mineplex/Games/survival-games.png" "assets/img/games/survival-games.png"
dl "$B/data/mineplex/Games/cake-wars.png" "assets/img/games/cake-wars.png"
dl "$B/data/mineplex/Games/nano-games-75e575053455.png" "assets/img/games/nano-games.png"
dl "$B/data/mineplex/Games/mixed-arcade.png" "assets/img/games/mixed-arcade.png"
dl "$B/data/mineplex/Games/turf-wars.png" "assets/img/games/turf-wars.png"
dl "$B/data/mineplex/Games/paintball.png" "assets/img/games/paintball.png"
dl "$B/data/mineplex/Games/micro-battle.png" "assets/img/games/micro-battle.png"
dl "$B/data/mineplex/Games/dragon-escape.png" "assets/img/games/dragon-escape.png"
dl "$B/data/mineplex/Games/super-smash-mobs.png" "assets/img/games/super-smash-mobs.png"
dl "$B/data/mineplex/Games/minestrike-6eef11199ba3.png" "assets/img/games/minestrike.png"
dl "$B/data/mineplex/Games/block-hunt-b795309f8fbb.png" "assets/img/games/block-hunt.png"
dl "$B/data/mineplex/Games/clans-299040f92660.png" "assets/img/games/clans.png"
dl "$B/data/mineplex/Games/mps.png" "assets/img/games/mps.png"
dl "$B/data/mineplex/Games/one-block-92a4a4c5b9d8.png" "assets/img/games/one-block.png"
dl "$B/data/mineplex/Games/castle-siege-46870694fc64.png" "assets/img/games/castle-siege.png"

# --- 新闻配图（映射已核对：大厅 <- newhubtest2_8，餐厅 <- 1133_4） ---
dl "$B/data/mineplex_images/newhubtest2_8.png" "assets/img/news/lobby.png"
dl "$B/data/mineplex_images/1133-3d1d5ec6a99c5f19ec0760fa4a9d1d13_4.png" "assets/img/news/restaurant.png"
dl "$B/data/mineplex_images/SSM_Banner.png" "assets/img/news/ssm.png"
dl "$B/data/mineplex_images/Halloween_Weekend_Event_5.png" "assets/img/news/halloween.png"

# --- MINEPLEX 金色 Logo（以 base64 随文本通道传输） ---
base64 -d assets/img/ui/logo.b64 > assets/img/ui/logo.png \
  && rm -f assets/img/ui/logo.b64 \
  && echo "OK   assets/img/ui/logo.png (decoded)"

echo "=== 素材抓取完成 ==="
