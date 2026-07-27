console.log("hello this was made by icumandidc so yeah uhh have fun kiddoinkadoinks");

let BeforeAsrielCutscene = true;

if (document.getElementById("soul_asriel").style.opacity === 0) {
    BeforeAsrielCutscene = false;
}

const Canvas = document.getElementById("togore_canvas");
const ctx = Canvas.getContext("2d");

const Radius = 230;
const TrailLength = 14;
const Colors = [
    [255,0,0],
    [0,255,0],
    [0,0,255],
    [128,0,128]
];

let AngleTime = 0;
const Trail = [];

const OriginalAsgoreImg = new Image();
OriginalAsgoreImg.src = "sprites/Asgore/spr_asgore_prebrandish_0.png"

const OriginalAsrielImg = new Image();
OriginalAsrielImg.src = "sprites/Asriel/God Of Hyperdeath/spr_asriel_afterimager_full_0.png";

const AfterImg = new Image();
AfterImg.src = "sprites/Asriel/God Of Hyperdeath/spr_asriel_afterimager_0.png";

let MainScaled, AfterScaled, AsgoreScaled;
let TintCache = [];

const FontImg = new Image();
FontImg.src = "fonts/defaultfont.png";

let FontW = 0;
let FontH = 0;

let asgore_width = 85 * 4

let Asgore_X = (Canvas.width - asgore_width) / 2;
let Asgore_Y = Canvas.height / 2 - 100;

const FontMap =
" " +
"!\"#$%&'()*+,-./" +
"0123456789:;<=>?" +
"@ABCDEFGHIJKLMNO" +
"PQRSTUVWXYZ[\\]^_" +
"`abcdefghijklmno" +
"pqrstuvwxyz{|}~";

const Buttons = ["FIGHT", "ACT", "ITEM", "MERCY"];
let Selected = 0;

const ButtonBaseNames = [
    "sprites/GUI/Buttons/spr_fightbt",
    "sprites/GUI/Buttons/spr_talkbt",
    "sprites/GUI/Buttons/spr_itembt",
    "sprites/GUI/Buttons/spr_sparebt"
];

const ButtonImgs = [];

for (let i = 0; i < 4; i++) {
    ButtonImgs[i] = [];

    const offImg = new Image();
    offImg.src = ButtonBaseNames[i] + "_0.png";
    ButtonImgs[i][0] = offImg;

    const onImg = new Image();
    onImg.src = ButtonBaseNames[i] + "_1.png";
    ButtonImgs[i][1] = onImg;
}

async function preloadAllAudio() {
    const sounds = {
        mus_bergentruckung: "music/mus_bergentruckung.ogg",
        mus_hopes: "music/mus_hopes_and_dreams.ogg",
        txt2: "sound/SND_TXT2.wav",
        // add more here
    };

    const loads = [];

    for (let key in sounds) {
        loads.push(AudioManager.load(key, sounds[key]));
    }

    await Promise.all(loads);
}

function DrawButtons() {
    const scale = 4;
    const tbW = Canvas.width * 0.78;
    const tbX = (Canvas.width - tbW) / 2;
    const tbY = Canvas.height * 0.60;
    const tbH = Canvas.height * 0.22;

    const leftX = tbX;
    const rightX = tbX + tbW;

    const count = 4;
    const spacing = (rightX - leftX) / (count - 1);
    const baseY = tbY + tbH + 10 * scale;

    for (let i = 0; i < count; i++) {
        const img = ButtonImgs[i][i === Selected ? 1 : 0];

        let x = leftX + spacing * i - (img.width * scale) / 2;

        if (i === 0) x += 55 * scale;
        if (i === 3) x -= 55 * scale;

        if (img.complete) {
            ctx.drawImage(img, x, baseY, img.width * scale, img.height * scale);
        } else {
            ctx.fillStyle = "white";
            ctx.font = (20 * scale) + "px Arial";
            ctx.fillText(Buttons[i], x, baseY);
        }
    }
}

window.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") {
        Selected = (Selected + 1) % 4;
    }
    if (e.key === "ArrowLeft") {
        Selected = (Selected - 1 + 4) % 4;
    }
    if (e.key === "Enter" || e.key === "z") {
        console.log(Buttons[Selected]);
    }
});

function DrawBattleBox() {
    const w = Canvas.width * 0.75;
    const h = Canvas.height * 0.45;

    const x = (Canvas.width - w) / 2;
    const y = Canvas.height * 0.12;

    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, w, h);
}

function DrawTextBox() {
    const w = Canvas.width * 0.78;
    const h = Canvas.height * 0.22;

    const x = (Canvas.width - w) / 2;
    const y = Canvas.height * 0.60;

    ctx.fillStyle = "black";
    ctx.fillRect(x, y, w, h);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 4 * 4;
    ctx.strokeRect(x, y, w, h);
}

function AlignText(text, scale, spacing, align, canvas){
    let w = text.length * (FontW * scale + spacing);
    let h = FontH * scale;

    let x = 0;
    let y = 0;

    if(align && align.x){
        if(align.x === "center") x = (canvas.width - w) / 2;
        else if(align.x === "right") x = canvas.width - w;
        else if(align.x === "left") x = 0;
    }

    if(align && align.y){
        if(align.y === "center") y = (canvas.height - h) / 2;
        else if(align.y === "down") y = canvas.height - h;
        else if(align.y === "up") y = 0;
    }

    return {x,y};
}

function DrawFont(text, x, y, scale=1, spacing=0, align={}){
    if(!FontW) return;

    if(align.x){
        const pos = AlignText(text, scale, spacing, align, ctx.canvas);
        x = pos.x;
    }

    if(align.y){
        const pos = AlignText(text, scale, spacing, align, ctx.canvas);
        y = pos.y;
    }

    let cx = x;

    for(let ch of text){
        const index = FontMap.indexOf(ch);
        if(index < 0){
            cx += FontW * scale + spacing;
            continue;
        }

        const sx = (index % 16) * FontW;
        const sy = Math.floor(index / 16) * FontH;

        ctx.drawImage(FontImg, sx, sy, FontW, FontH,
                      cx, y, FontW * scale, FontH * scale);

        cx += FontW * scale + spacing;
    }
}

let WT_Text = "";
let WT_Index = 0;
let WT_Delay = 40;
let WT_Last = 0;
let WT_Sound = null;
let WT_X = 0;
let WT_Y = 0;
let WT_Scale = 1;
let WT_Spacing = 0;
let WT_Align = {};

function WriteText(text, x, y, scale=1, spacing=0, align={}, delay=40, sound=null){
    WT_Text = text;
    WT_Index = 0;
    WT_X = x;
    WT_Y = y;
    WT_Scale = scale;
    WT_Spacing = spacing;
    WT_Align = align;
    WT_Delay = delay;
    WT_Sound = sound;
}

function UpdateWriteText(){
    let now = performance.now();
    if(now - WT_Last >= WT_Delay && WT_Index < WT_Text.length){
        WT_Index++;
        WT_Last = now;
        if(WT_Sound){
            WT_Sound.cloneNode(true).play();
        }
    }
    if(WT_Index > 0){
        DrawFont(WT_Text.slice(0, WT_Index), WT_X, WT_Y, WT_Scale, WT_Spacing, WT_Align);
    }
}

function ResizeCanvas(){
    Canvas.width = innerWidth;
    Canvas.height = innerHeight;

    if (BeforeAsrielCutscene === false) {
        if(OriginalAsrielImg.complete){
            MainScaled = document.createElement("canvas");
            MainScaled.width = OriginalAsrielImg.width * 4;
            MainScaled.height = OriginalAsrielImg.height * 4;
            MainScaled.getContext("2d").drawImage(OriginalAsrielImg, 0, 0, MainScaled.width, MainScaled.height);
        }

        if(AfterImg.complete){
            AfterScaled = document.createElement("canvas");
            AfterScaled.width = AfterImg.width * 4;
            AfterScaled.height = AfterImg.height * 4;
            AfterScaled.getContext("2d").drawImage(AfterImg, 0, 0, AfterScaled.width, AfterScaled.height);
            TintCache = [];
        }
    } else {
        if (OriginalAsgoreImg.complete) {
            AsgoreScaled = document.createElement("canvas");
            AsgoreScaled.width = OriginalAsgoreImg.width * 4;
            AsgoreScaled.height = OriginalAsgoreImg.height * 4;
            AsgoreScaled.getContext("2d").drawImage(OriginalAsgoreImg, 0, 0, AsgoreScaled.width, AsgoreScaled.height);
        }
    }

    if(FontImg.complete){
        FontW = FontImg.width / 16;
        FontH = FontImg.height / 6;
    }
}

function EaseInOut(t){
    return 0.5 - Math.cos(t * Math.PI) / 2;
}

function LerpColor(a,b,t){
    return a.map((v,i)=>v+(b[i]-v)*t);
}

function GetTinted(index){
    if (TintCache[index]) return TintCache[index];

    const Off = document.createElement("canvas");
    Off.width = AfterScaled.width;
    Off.height = AfterScaled.height;

    const C = Off.getContext("2d");
    const Col = Colors[index];

    C.globalCompositeOperation = "source-over";
    C.drawImage(AfterScaled, 0, 0);

    C.globalCompositeOperation = "source-atop";
    C.fillStyle = `rgb(${Col[0]}, ${Col[1]}, ${Col[2]})`;
    C.fillRect(0, 0, Off.width, Off.height);

    C.globalCompositeOperation = "source-over";

    TintCache[index] = Off;
    return Off;
}

function UpdateTrail(x,y){
    Trail.unshift({x,y});
    if(Trail.length > TrailLength) Trail.pop();
}

function DrawTrail(){
    if(!AfterScaled) return;
    for(let i=0;i<Trail.length;i++){
        const P = Trail[i];
        const Fade = 1 - i/TrailLength;

        const ColorPos = (i / TrailLength) * (Colors.length - 1);
        const Idx = Math.floor(ColorPos);
        const Img = GetTinted(Idx);

        ctx.globalAlpha = Fade * 0.7;
        ctx.drawImage(Img, P.x - Img.width/2, P.y - Img.height/2);
    }
}

function DrawMain(x,y){
    if(!MainScaled) return;
    ctx.globalAlpha = 1;
    ctx.drawImage(MainScaled, x - MainScaled.width/2, y - MainScaled.height/2);
}

function DrawAsgore(x, y){
    if(!AsgoreScaled) return;
    ctx.globalAlpha = 1;
    ctx.drawImage(AsgoreScaled, x - AsgoreScaled.width / 2, y - AsgoreScaled.height/2);
}

function Loop(){
    AngleTime += 0.006;
    const Phase = Math.sin(AngleTime)*0.5 + 0.5;
    const A = EaseInOut(Phase) * Math.PI;

    const CX = Canvas.width/2;
    const CY = Canvas.height/2 - 100;

    const X = CX + Math.cos(A)*Radius;
    const Y = CY - Math.sin(A)*Radius;

    ctx.fillStyle = "black";
    ctx.fillRect(0,0,Canvas.width,Canvas.height);

    UpdateTrail(X,Y);
    DrawTrail();
    DrawMain(X,Y);
    DrawAsgore(Asgore_X, Asgore_Y);

    DrawTextBox();
    UpdateWriteText();
    DrawButtons();

    requestAnimationFrame(Loop);
}

function Init(){
    const w = Canvas.width * 0.78;
    const h = Canvas.height * 0.22;

    if (document.getElementById("soul_asriel").style.opacity === 1) {
        const asriel_music = new Audio("music/mus_xpart.ogg");
        asriel_music.play();
    } else {
        AudioManager.play("mus_bergentruckung", true, 1.0);
            WriteText(
                "* (A strange light fills the room.)",
                ((Canvas.width - w) / 2) + 45,
                Canvas.height * 0.57,
                4,
                2,
                {},
                40,
                new Audio("sound/SND_TXT2.wav")
            );

            setTimeout(() => {
                DrawTextBox();
                WriteText(
                    "* (Twilight is shining through the barrier.)",
                    ((Canvas.width - w) / 2) + 45,
                    Canvas.height * 0.57,
                    4,
                    2,
                    {},
                    40,
                    new Audio("sound/SND_TXT2.wav")
                );
            }, 5000);

            setTimeout(() => {
                DrawTextBox();
                WriteText(
                    "* (It seems your journey is finally over.)",
                    ((Canvas.width - w) / 2) + 45,
                    Canvas.height * 0.57,
                    4,
                    2,
                    {},
                    40,
                    new Audio("sound/SND_TXT2.wav")
                );
            }, 10000);

    }

    ResizeCanvas();
    Loop();
}

OriginalAsrielImg.onload = Init;
AfterImg.onload = Init;
FontImg.onload = ResizeCanvas;
OriginalAsgoreImg.onload = Init;

window.addEventListener("resize", ResizeCanvas);
ResizeCanvas();