(function(root){
  'use strict';
  const groups={
    '動物':'ねこ|いぬ|うさぎ|ぞう|きりん|ライオン|パンダ|くま|さる|ゴリラ|しまうま|かば|さい|とら|ひつじ|やぎ|うま|ぶた|うし|にわとり|ひよこ|あひる|ペンギン|ふくろう|わし|すずめ|からす|くじゃく|かめ|わに|へび|かえる|イルカ|くじら|さめ|たこ|いか|かに|ちょうちょ|かたつむり',
    '食べ物':'おにぎり|カレーライス|ラーメン|うどん|そば|すし|ピザ|ハンバーガー|サンドイッチ|ホットドッグ|たこやき|お好み焼き|ぎょうざ|しゅうまい|オムライス|目玉焼き|パンケーキ|食パン|クロワッサン|ドーナツ|ケーキ|プリン|アイスクリーム|かき氷|チョコレート|クッキー|ポップコーン|りんご|バナナ|いちご|すいか|ぶどう|みかん|もも|パイナップル|にんじん|トマト|とうもろこし|ブロッコリー|さつまいも',
    '身近なもの':'えんぴつ|消しゴム|はさみ|定規|ノート|ランドセル|時計|めがね|かさ|長ぐつ|ぼうし|手ぶくろ|くつ下|歯ブラシ|コップ|スプーン|フォーク|フライパン|やかん|冷蔵庫|洗濯機|テレビ|扇風機|掃除機|ベッド|いす|机|ドア|窓|電球|電話|カメラ|自転車|バス|電車|飛行機|船|ボール|ギター|風船',
    '動き・場面':'ねこが昼寝する|いぬが走る|うさぎがジャンプする|ぞうが水を浴びる|パンダが竹を食べる|さるがバナナを食べる|ペンギンがすべる|かめが泳ぐ|鳥が巣を作る|魚が跳ねる|雨の中を歩く|雪だるまを作る|砂のお城を作る|花に水をあげる|木に登る|山に登る|海で泳ぐ|釣りをする|自転車に乗る|スキーをする|サッカーをする|野球をする|なわとびをする|ダンスをする|歌を歌う|ギターを弾く|本を読む|絵を描く|写真を撮る|料理をする|皿を洗う|洗濯物を干す|掃除をする|歯を磨く|お風呂に入る|寝坊する|プレゼントを渡す|ケーキのろうそくを吹く|おばけから逃げる|宇宙を飛ぶ'
  };
  const prompts=Object.entries(groups).flatMap(([category,list])=>list.split('|').map((text,i)=>({id:category+'-'+i,category,text})));
  function plan(n,lead=0){
    if(!Number.isInteger(n)||n<3||n>12)throw Error('人数は3〜12人');
    return Array.from({length:n},(_,i)=>({id:lead+'-'+i,player:(lead+i)%n,type:n%2&&i===0?'prompt':((i-(n%2))%2===0?'draw':'guess')}));
  }
  function choose(category,used){const pool=prompts.filter(p=>(category==='すべて'||p.category===category)&&!used.includes(p.id));return pool.length?pool[Math.floor(Math.random()*pool.length)]:null;}
  function round(game,index){const prompt=choose(game.settings.category,game.used);if(!prompt)throw Error('このカテゴリのお題をすべて使いました。');game.used.push(prompt.id);return {index,prompt,steps:plan(game.players.length,index%game.players.length).map(s=>({...s,id:index+'-'+s.id,remaining:s.type==='draw'?game.settings.drawTime:s.type==='guess'?game.settings.guessTime:0,strokes:[],text:'',done:false})),cursor:0,reveal:0};}
  function create(players,settings){const game={schemaVersion:1,id:Date.now().toString(36),players,settings,used:[],rounds:[],index:0,status:'playing',phase:'handoff'};game.rounds.push(round(game,0));return game;}
  const api={groups,prompts,plan,choose,round,create};root.TeleCore=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
