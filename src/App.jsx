import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// Icons: Phosphor, aliased to the names used throughout so call sites stay put.
import {
  IconContext,
  Pulse as Activity,
  CalendarDots as CalendarDays,
  Check,
  CaretRight as ChevronRight,
  ChatCircleText,
  Circle as CircleDot,
  Crown,
  Fire as Flame,
  Heart,
  SquaresFour as LayoutGrid,
  PaperPlaneTilt,
  SignIn as LogIn,
  SignOut as LogOut,
  Megaphone,
  Medal,
  List as Menu,
  Plus,
  Broadcast as Radio,
  ArrowsClockwise as RefreshCw,
  MagnifyingGlass as Search,
  GearSix as Settings2,
  Shield,
  Sparkle as Sparkles,
  Sword as Swords,
  Target,
  Trash as Trash2,
  Trophy,
  UploadSimple as Upload,
  UsersThree as Users,
  ListChecks as Vote,
  WifiHigh as Wifi,
  WifiSlash as WifiOff,
  MonitorPlay,
  X,
} from "@phosphor-icons/react";

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Hanken+Grotesk:wght@400..800&display=swap";

const CSS = `
*,*::before,*::after{box-sizing:border-box}*{margin:0}html,body,#root{min-height:100%}body{font-family:var(--font-body);background:var(--bg);color:var(--ink);-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}button,input,select,textarea{font:inherit}button{border:0}img,svg{display:block}.num{font-family:var(--font-display);font-variant-numeric:tabular-nums;font-feature-settings:"tnum"}.right{text-align:right}
:root{
  color-scheme:light;
  --font-body:'Hanken Grotesk',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;--font-display:'Bricolage Grotesque','Hanken Grotesk',sans-serif;
  --bg:#eceef2;--bg-deep:#070d18;--surface:#ffffff;--surface-soft:#f5f7fa;--surface-warm:#fffaf1;
  --ink:#0d1320;--muted:#616c7d;--faint:#9aa4b2;--line:#e9edf2;--line-strong:#d8dee7;
  --green:#02a25c;--green-dark:#0a6f45;--green-soft:#e6f6ee;--green-line:#bce9d1;
  --red:#e2334f;--red-soft:#fde7ec;--amber:#d98506;--amber-soft:#fff3da;--blue:#3068ec;--blue-soft:#eaf0ff;
  --gold:#d8a200;--silver:#9aa6b2;--bronze:#c0813e;--nav:#0b1322;--nav-2:#121d31;
  --radius-xl:30px;--radius-lg:24px;--radius-md:16px;--radius-sm:12px;--side:280px;
  --gap:24px;--pad:44px;
  --shadow-xs:0 1px 2px rgba(13,19,32,.05);--shadow-sm:0 12px 30px rgba(13,19,32,.06);--shadow-md:0 26px 60px rgba(13,19,32,.11);--ring:0 0 0 4px rgba(2,162,92,.16);
}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}}
:where(button,a,input,select,textarea):focus-visible{outline:0;box-shadow:var(--ring);border-radius:10px}
::selection{background:var(--green-soft);color:var(--green-dark)}::-webkit-scrollbar{width:10px;height:10px}::-webkit-scrollbar-thumb{background:#ccd5df;border-radius:999px;border:3px solid var(--bg)}::-webkit-scrollbar-track{background:transparent}
.app-shell{min-height:100vh;display:flex;background:radial-gradient(circle at 14% 0%,rgba(0,163,92,.13),transparent 30%),radial-gradient(circle at 90% 10%,rgba(47,111,237,.11),transparent 28%),var(--bg)}
.sidebar{position:fixed;inset:0 auto 0 0;width:var(--side);background:linear-gradient(180deg,var(--nav),#07101d);color:#fff;z-index:50;display:flex;flex-direction:column;border-right:1px solid rgba(255,255,255,.08);box-shadow:18px 0 45px rgba(7,16,29,.16)}
.brand{padding:26px 24px 22px;display:flex;gap:14px;align-items:center;border-bottom:1px solid rgba(255,255,255,.08)}.brand-mark{width:48px;height:48px;border-radius:18px;background:linear-gradient(135deg,#00bd72,#007d49);display:grid;place-items:center;box-shadow:0 18px 40px rgba(0,163,92,.26)}.brand-mark svg{width:25px;height:25px}.brand-title{font-size:17px;font-weight:900;letter-spacing:-.045em;line-height:1}.brand-sub{font-size:11px;color:#8fa0b6;font-weight:800;text-transform:uppercase;letter-spacing:.11em;margin-top:6px}
.nav{padding:18px 14px;display:flex;flex-direction:column;gap:6px;flex:1;overflow:auto}.nav-kicker{font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:#7c8ca3;font-weight:900;padding:12px 12px 8px}.navitem{width:100%;display:flex;align-items:center;gap:12px;padding:12px 13px;border-radius:15px;background:transparent;color:#aebbd0;cursor:pointer;font-weight:800;font-size:14px;text-align:left;transition:.16s ease}.navitem:hover{background:rgba(255,255,255,.06);color:#fff}.navitem.active{background:linear-gradient(135deg,rgba(0,163,92,.22),rgba(0,163,92,.11));color:#fff;box-shadow:inset 0 0 0 1px rgba(188,235,210,.14)}.navitem svg{width:19px;height:19px}.navitem .nav-badge{margin-left:auto;background:var(--red);color:#fff;border-radius:999px;padding:2px 8px;font-size:10px;font-weight:900}.side-footer{padding:16px 14px 18px;border-top:1px solid rgba(255,255,255,.08)}.account-card{display:flex;align-items:center;gap:11px;padding:10px;border-radius:18px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08)}.account-meta{min-width:0;flex:1}.account-name{font-size:14px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.account-role{font-size:11px;color:#8fa0b6;text-transform:capitalize;font-weight:800;margin-top:2px}.icon-btn{width:36px;height:36px;display:grid;place-items:center;border-radius:12px;cursor:pointer;background:rgba(255,255,255,.08);color:#aebbd0;transition:.16s}.icon-btn:hover{background:rgba(224,49,79,.18);color:#fff}.icon-btn svg{width:17px;height:17px}.signin-btn{width:100%;display:flex;align-items:center;justify-content:center;gap:9px;padding:12px 14px;border-radius:15px;background:linear-gradient(135deg,#00aa62,#07804c);color:#fff;cursor:pointer;font-weight:900;box-shadow:0 16px 34px rgba(0,163,92,.25);transition:.16s}.signin-btn:hover{transform:translateY(-1px);box-shadow:0 21px 42px rgba(0,163,92,.32)}.signin-btn svg{width:17px;height:17px}
.main{margin-left:var(--side);min-width:0;flex:1}.topbar{position:sticky;top:0;z-index:40;height:84px;display:flex;align-items:center;justify-content:space-between;gap:18px;padding:0 var(--pad);background:rgba(236,238,242,.74);backdrop-filter:blur(18px) saturate(1.3);border-bottom:1px solid rgba(216,222,231,.7)}.mobile-menu{display:none}.top-title{font-family:var(--font-display);font-size:26px;font-weight:800;letter-spacing:-.04em}.top-subtitle{font-size:13px;color:var(--muted);font-weight:600;margin-top:2px}.top-actions{display:flex;align-items:center;gap:10px}.page{width:100%;max-width:1280px;margin:0 auto;padding:40px var(--pad) 104px}.rise{animation:rise .4s cubic-bezier(.16,1,.3,1) both}@keyframes rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.sync{display:flex;align-items:center;gap:8px;border-radius:999px;padding:9px 13px;border:1px solid var(--line-strong);background:rgba(255,255,255,.72);color:var(--muted);font-size:12px;font-weight:900;cursor:pointer;box-shadow:var(--shadow-xs)}.sync.ok{color:var(--green-dark);border-color:var(--green-line);background:var(--green-soft)}.sync.warn{color:var(--amber);border-color:#f1d7a5;background:var(--amber-soft)}.sync svg{width:15px;height:15px}.status-dot{width:8px;height:8px;border-radius:999px;background:var(--green);box-shadow:0 0 0 5px rgba(0,163,92,.12);animation:pulse 1.8s infinite}.status-dot.red{background:var(--red);box-shadow:0 0 0 5px rgba(224,49,79,.12);animation:pulse 1.1s infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.42}}@keyframes spin{to{transform:rotate(360deg)}}.spin{animation:spin .85s linear infinite}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:13px;cursor:pointer;font-weight:900;font-size:13px;transition:.16s ease;white-space:nowrap}.btn svg{width:16px;height:16px}.btn-primary{background:linear-gradient(135deg,#00a963,#087b4b);color:#fff;padding:11px 17px;box-shadow:0 14px 28px rgba(0,163,92,.22)}.btn-primary:hover{transform:translateY(-1px);box-shadow:0 18px 36px rgba(0,163,92,.29)}.btn-primary:disabled{opacity:.5;cursor:not-allowed;transform:none;box-shadow:none}.btn-soft{background:#fff;color:var(--muted);border:1px solid var(--line-strong);padding:10px 15px}.btn-soft:hover{color:var(--ink);box-shadow:var(--shadow-xs)}.btn-danger{background:var(--red-soft);color:var(--red);padding:8px 11px}.btn-small{padding:8px 12px;font-size:12px}.btn-ghost{background:transparent;color:var(--muted);padding:8px 10px}.btn-ghost:hover{background:var(--surface-soft);color:var(--ink)}
.panel{background:rgba(255,255,255,.86);border:1px solid rgba(211,219,230,.78);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);overflow:hidden}.panel.pad{padding:20px}.panel-head{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:18px 20px;border-bottom:1px solid var(--line);background:linear-gradient(180deg,#fff,rgba(247,249,252,.78))}.panel-title{display:flex;align-items:center;gap:10px;font-size:16px;font-weight:900;letter-spacing:-.025em}.panel-title svg{width:18px;height:18px;color:var(--green)}.panel-link{display:flex;align-items:center;gap:4px;color:var(--green-dark);font-size:12px;font-weight:900;cursor:pointer}.panel-link svg{width:14px;height:14px}.section-head{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:16px}.section-title{display:flex;align-items:center;gap:10px;font-size:18px;font-weight:900;letter-spacing:-.035em}.section-title svg{width:19px;height:19px;color:var(--green)}
.hero{position:relative;overflow:hidden;border-radius:32px;padding:28px;background:linear-gradient(135deg,#08111f 0%,#11243a 54%,#0b3b2b 100%);color:#fff;box-shadow:var(--shadow-md);margin-bottom:22px}.hero::before{content:"";position:absolute;inset:-40% -18% auto auto;width:520px;height:520px;border-radius:999px;background:radial-gradient(circle,rgba(0,220,130,.28),transparent 65%)}.hero::after{content:"";position:absolute;inset:auto auto -48% -18%;width:420px;height:420px;border-radius:999px;background:radial-gradient(circle,rgba(47,111,237,.2),transparent 62%)}.hero-content{position:relative;z-index:1;display:grid;grid-template-columns:minmax(0,1.2fr) minmax(360px,.8fr);gap:24px;align-items:stretch}.eyebrow{display:inline-flex;align-items:center;gap:8px;padding:7px 11px;border-radius:999px;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.12);font-size:11px;font-weight:900;letter-spacing:.09em;text-transform:uppercase;color:#bad0e4}.eyebrow svg{width:14px;height:14px;color:#5ee2a4}.hero h1{font-size:42px;line-height:.98;font-weight:900;letter-spacing:-.075em;margin:16px 0 12px;max-width:760px}.hero-copy{color:#b9c8d7;font-size:15px;line-height:1.65;max-width:720px}.hero-metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:11px;margin-top:22px}.hero-mini{padding:13px 14px;border-radius:18px;background:rgba(255,255,255,.075);border:1px solid rgba(255,255,255,.095)}.hero-mini-value{font-family:var(--font-display);font-size:24px;font-weight:800}.hero-mini-label{font-size:11px;color:#95a8bd;font-weight:800;text-transform:uppercase;letter-spacing:.055em;margin-top:3px}.spotlight{background:rgba(255,255,255,.095);border:1px solid rgba(255,255,255,.13);border-radius:26px;padding:18px;display:flex;flex-direction:column;min-height:100%}.spot-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:15px}.spot-label{font-size:12px;color:#9db0c5;font-weight:900;text-transform:uppercase;letter-spacing:.08em}.spot-card{background:#fff;color:var(--ink);border-radius:22px;padding:17px;box-shadow:0 24px 45px rgba(0,0,0,.22)}
.metric-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-bottom:22px}.metric{background:rgba(255,255,255,.88);border:1px solid rgba(211,219,230,.78);border-radius:22px;padding:18px;box-shadow:var(--shadow-xs)}.metric-icon{width:40px;height:40px;border-radius:15px;display:grid;place-items:center;margin-bottom:14px}.metric-icon svg{width:19px;height:19px}.metric-value{font-family:var(--font-display);font-size:30px;line-height:1;font-weight:800;letter-spacing:-.04em}.metric-value.small{font-size:20px}.metric-label{font-size:12px;color:var(--muted);font-weight:800;margin-top:6px}.metric-note{font-size:11px;color:var(--faint);font-weight:700;margin-top:8px}.dashboard-grid{display:grid;grid-template-columns:minmax(0,1fr) 430px;gap:22px;align-items:start}.stack{display:flex;flex-direction:column;gap:22px}.stand-sticky{position:sticky;top:98px}
.match-list{padding:8px}.match-card{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);gap:14px;align-items:center;padding:16px;border-radius:18px;transition:.16s ease;position:relative}.match-card+.match-card{border-top:1px solid var(--line)}.match-card:hover{background:var(--surface-soft)}.match-card.clash{background:linear-gradient(90deg,rgba(0,163,92,.12),rgba(255,255,255,.82) 62%)}.match-card.live{box-shadow:inset 0 0 0 1px rgba(224,49,79,.24);background:linear-gradient(90deg,rgba(224,49,79,.11),rgba(255,255,255,.86))}.team{display:flex;gap:11px;align-items:center;min-width:0}.team.right{flex-direction:row-reverse}.team-meta{min-width:0}.team-name{font-size:15px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-.02em}.team-name.right{text-align:right}.team-owner{display:flex;align-items:center;gap:5px;margin-top:4px;font-size:11px;font-weight:850;color:var(--muted)}.team-owner.right{flex-direction:row-reverse}.team-owner .avatar{box-shadow:0 0 0 1px rgba(255,255,255,.8);font-size:8px}.team-owner svg{width:12px;height:12px}.match-mid{min-width:92px;display:flex;flex-direction:column;align-items:center;gap:7px}.score{font-family:var(--font-display);font-size:28px;font-weight:800;line-height:1;letter-spacing:.02em}.vs{font-family:var(--font-display);font-size:13px;font-weight:800;color:var(--faint);letter-spacing:.12em}.match-time{font-size:10.5px;color:var(--faint);font-weight:850}.clash-note{display:flex;align-items:center;gap:5px;font-size:10.5px;color:var(--green-dark);font-weight:900}.clash-note svg{width:12px;height:12px}.flag-fallback{font-size:10px;font-weight:900;color:var(--faint)}.tag{display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:4px 9px;font-size:10px;font-weight:950;letter-spacing:.07em;text-transform:uppercase}.tag.live{background:var(--red-soft);color:var(--red)}.tag.done{background:var(--green-soft);color:var(--green-dark)}.tag.soon{background:var(--surface-soft);color:var(--muted);border:1px solid var(--line-strong)}.tag.admin{background:var(--blue-soft);color:var(--blue)}
.avatar{border-radius:999px;display:grid;place-items:center;position:relative;overflow:hidden;color:#fff;font-family:var(--font-display);font-weight:800;flex:0 0 auto;box-shadow:0 0 0 3px #fff,0 8px 18px rgba(9,17,32,.12)}.avatar img{width:100%;height:100%;object-fit:cover}.flag{object-fit:cover;flex:0 0 auto;box-shadow:0 1px 3px rgba(9,17,32,.18)}.flag.round{border-radius:999px}.flag.rect{border-radius:5px}.stand-row{width:100%;display:flex;align-items:center;gap:13px;padding:13px 18px;cursor:pointer;transition:.16s}.stand-row+.stand-row{border-top:1px solid var(--line)}.stand-row:hover{background:var(--surface-soft)}.rank{width:26px;text-align:center;font-family:var(--font-display);font-size:17px;font-weight:800;color:var(--faint)}.rank.gold{color:var(--gold)}.rank.silver{color:var(--silver)}.rank.bronze{color:var(--bronze)}.stand-info{min-width:0;flex:1}.stand-name{font-size:14.5px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mini-flags{display:flex;gap:4px;margin-top:5px}.stand-points{text-align:right}.stand-points strong{font-family:var(--font-display);font-size:21px}.stand-points span{display:block;font-size:9.5px;color:var(--faint);font-weight:900;text-transform:uppercase;letter-spacing:.07em}.announcement{display:flex;gap:14px;padding:15px 18px}.announcement+.announcement{border-top:1px solid var(--line)}.announcement-icon{width:34px;height:34px;border-radius:13px;display:grid;place-items:center;background:var(--green-soft);color:var(--green-dark);flex:0 0 auto}.announcement-icon svg{width:16px;height:16px}.announcement-text{font-size:13.5px;line-height:1.55;font-weight:620}.announcement-date{font-size:11px;color:var(--faint);font-weight:800;margin-top:4px}
.table-wrap{overflow:auto}.leader-table,.admin-table{width:100%;border-collapse:collapse;min-width:860px}.leader-table th,.admin-table th{text-align:left;padding:14px 18px;background:var(--surface-soft);border-bottom:1px solid var(--line);font-size:10.5px;color:var(--faint);font-weight:950;text-transform:uppercase;letter-spacing:.07em}.leader-table th.right,.admin-table th.right{text-align:right}.leader-table td,.admin-table td{padding:15px 18px;border-bottom:1px solid var(--line);vertical-align:middle}.leader-table tr:last-child td,.admin-table tr:last-child td{border-bottom:0}.leader-table tbody tr{transition:.14s}.leader-table tbody tr:hover{background:var(--surface-soft)}.player-cell{display:flex;align-items:center;gap:13px}.color-rail{width:4px;height:42px;border-radius:99px}.player-name{font-size:15px;font-weight:950;letter-spacing:-.02em}.player-meta{display:flex;align-items:center;gap:5px;font-size:11.5px;color:var(--muted);font-weight:750;margin-top:3px}.player-meta svg{width:12px;height:12px}.flag-row{display:flex;gap:5px;align-items:center;flex-wrap:wrap}.form-row{display:flex;gap:5px;justify-content:flex-end}.form-chip{width:24px;height:24px;border-radius:8px;display:grid;place-items:center;color:#fff;font-size:10px;font-weight:950}.form-chip.w{background:var(--green)}.form-chip.d{background:var(--amber)}.form-chip.l{background:var(--red)}.form-chip.empty{background:var(--line-strong);color:var(--faint)}.points-block{text-align:right}.points-block strong{font-family:var(--font-display);font-size:26px}.progress{width:130px;height:6px;background:var(--line);border-radius:999px;overflow:hidden;margin-left:auto;margin-top:7px}.progress span{display:block;height:100%;border-radius:999px;min-width:2px}.scoring{display:flex;flex-wrap:wrap;gap:8px 16px;margin-top:15px;color:var(--muted);font-size:12px;font-weight:700}.scoring b{color:var(--ink);font-family:var(--font-display)}
.day{margin-bottom:24px}.day-header{display:flex;align-items:center;gap:13px;margin-bottom:12px}.day-pill{display:flex;align-items:center;gap:8px;border-radius:999px;background:#fff;border:1px solid var(--line);padding:8px 14px;font-size:13px;font-weight:900;box-shadow:var(--shadow-xs)}.day-pill svg{width:15px;height:15px;color:var(--green)}.day-line{height:1px;background:var(--line-strong);flex:1}.day-count{font-size:11px;color:var(--faint);font-weight:900}.filter-row{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:20px}.chips{display:flex;gap:8px;flex-wrap:wrap}.filter-chip{border:1px solid var(--line-strong);background:#fff;color:var(--muted);border-radius:999px;padding:8px 12px;cursor:pointer;font-size:12px;font-weight:900}.filter-chip.active{background:var(--green-soft);border-color:var(--green-line);color:var(--green-dark)}.search{position:relative;min-width:260px}.search svg{position:absolute;left:13px;top:50%;transform:translateY(-50%);width:16px;height:16px;color:var(--faint)}.input,.select,.textarea{width:100%;border:1.5px solid var(--line-strong);border-radius:14px;background:#fff;color:var(--ink);outline:0;transition:.14s}.input{padding:12px 14px}.search .input{padding-left:39px}.select{padding:9px 12px;font-weight:800}.textarea{padding:12px 14px;resize:vertical;min-height:96px}.input:focus,.select:focus,.textarea:focus{border-color:var(--green);box-shadow:var(--ring)}.field{margin-bottom:15px}.field label{display:block;font-size:11px;color:var(--muted);font-weight:950;text-transform:uppercase;letter-spacing:.06em;margin-bottom:7px}
.player-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(286px,1fr));gap:16px}.player-card{background:rgba(255,255,255,.9);border:1px solid rgba(211,219,230,.8);border-radius:24px;box-shadow:var(--shadow-sm);overflow:hidden;cursor:pointer;transition:.18s}.player-card:hover{transform:translateY(-3px);box-shadow:var(--shadow-md)}.player-card-top{padding:20px;display:flex;align-items:center;gap:14px;position:relative}.rank-badge{position:absolute;top:14px;right:14px;padding:4px 10px;border-radius:999px;background:var(--surface-soft);border:1px solid var(--line);color:var(--faint);font-size:12px;font-weight:950;font-family:var(--font-display)}.card-name{font-size:20px;font-weight:950;letter-spacing:-.04em}.card-points{display:flex;align-items:baseline;gap:5px;margin-top:5px}.card-points strong{font-family:var(--font-display);font-size:27px;color:var(--green);line-height:1}.card-points span{font-size:11px;color:var(--faint);font-weight:950;text-transform:uppercase}.country-chips{display:flex;flex-wrap:wrap;gap:7px;padding:12px 20px;border-top:1px solid var(--line)}.country-chip{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--line-strong);background:var(--surface-soft);border-radius:999px;padding:6px 10px;font-size:12px;font-weight:800}.country-chip.out{opacity:.45;text-decoration:line-through}.wdl-grid{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--line)}.wdl-box{padding:13px;text-align:center}.wdl-box+.wdl-box{border-left:1px solid var(--line)}.wdl-value{font-family:var(--font-display);font-size:18px;font-weight:800}.wdl-value.w{color:var(--green)}.wdl-value.d{color:var(--amber)}.wdl-value.l{color:var(--red)}.wdl-label{font-size:9.5px;color:var(--faint);font-weight:950;text-transform:uppercase;letter-spacing:.07em;margin-top:3px}
.vote-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(355px,1fr));gap:16px;margin-bottom:30px}.vote-card,.poll-card{background:#fff;border:1px solid var(--line);border-radius:24px;box-shadow:var(--shadow-sm);overflow:hidden}.vote-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:16px 18px;border-bottom:1px solid var(--line);background:var(--surface-soft)}.vote-title{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:950;min-width:0}.vote-date{font-size:11px;color:var(--faint);font-weight:900;white-space:nowrap}.vote-body{padding:17px 18px}.vote-options{display:grid;grid-template-columns:1fr .8fr 1fr;gap:8px;margin-bottom:16px}.vote-option{border:1.5px solid var(--line-strong);border-radius:14px;background:#fff;color:var(--muted);padding:10px 8px;cursor:pointer;font-size:12px;font-weight:950;transition:.14s;overflow:hidden;text-overflow:ellipsis}.vote-option:hover{border-color:var(--green);color:var(--green-dark)}.vote-option.active{background:var(--green-soft);border-color:var(--green);color:var(--green-dark)}.vote-row{display:flex;align-items:center;gap:10px;margin-bottom:10px}.vote-row-label{width:58px;font-size:12px;color:var(--muted);font-weight:850;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.vote-track{height:9px;background:var(--line);border-radius:999px;overflow:hidden;flex:1}.vote-fill{height:100%;border-radius:999px;transition:width .42s cubic-bezier(.16,1,.3,1)}.vote-pct{width:38px;text-align:right;font-family:var(--font-display);font-size:12px;font-weight:800;color:var(--muted)}.vote-meta{display:flex;align-items:center;gap:7px;font-size:11.5px;color:var(--muted);font-weight:800;margin-top:14px;padding-top:14px;border-top:1px solid var(--line)}.vote-meta svg{width:13px;height:13px;color:var(--green)}.poll-card{padding:18px;margin-bottom:15px}.poll-question{display:flex;align-items:center;gap:10px;font-size:15px;font-weight:950;margin-bottom:14px}.poll-question svg{width:17px;height:17px;color:var(--green)}.poll-option{border:0;background:transparent;padding:0;width:100%;display:flex;align-items:center;gap:10px;margin-bottom:10px;cursor:pointer}.poll-bar{position:relative;min-height:40px;border-radius:15px;background:var(--surface-soft);border:1.5px solid var(--line-strong);overflow:hidden;flex:1}.poll-option:hover .poll-bar{border-color:var(--green)}.poll-option.active .poll-bar{border-color:var(--green)}.poll-fill{position:absolute;inset:0 auto 0 0;background:var(--green-soft);transition:width .42s cubic-bezier(.16,1,.3,1)}.poll-text{position:relative;z-index:1;min-height:40px;display:flex;align-items:center;gap:9px;padding:0 14px;font-size:13px;font-weight:850}.poll-pct{margin-left:auto;font-family:var(--font-display);font-weight:800;color:var(--muted);font-size:12px}.check-bubble{width:20px;height:20px;display:grid;place-items:center;border-radius:999px;background:var(--green);color:#fff}.check-bubble svg{width:12px;height:12px}
.admin-banner{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;padding:17px 20px;border-radius:22px;border:1px solid var(--line);box-shadow:var(--shadow-xs);margin-bottom:20px;background:#fff}.admin-banner.ok{background:var(--green-soft);border-color:var(--green-line)}.admin-banner.warn{background:var(--amber-soft);border-color:#efd49e}.admin-left{display:flex;align-items:center;gap:13px}.admin-left svg{width:22px}.admin-title{font-size:14px;font-weight:950}.admin-copy{font-size:12px;color:var(--muted);font-weight:650;line-height:1.45;max-width:760px;margin-top:2px}.tabs{display:flex;gap:5px;background:rgba(255,255,255,.75);border:1px solid var(--line);border-radius:17px;padding:5px;width:fit-content;margin-bottom:20px}.tab-btn{display:flex;align-items:center;gap:8px;border-radius:13px;padding:10px 15px;background:transparent;color:var(--muted);cursor:pointer;font-size:13px;font-weight:950}.tab-btn svg{width:16px;height:16px}.tab-btn.active{background:#fff;color:var(--green-dark);box-shadow:var(--shadow-xs)}.score-input{width:48px;text-align:center;border:1.5px solid var(--line-strong);border-radius:12px;padding:7px 5px;font-family:var(--font-display);font-weight:800;outline:0}.score-input:focus{border-color:var(--green);box-shadow:var(--ring)}.admin-table td{font-size:13px}.eliminate-chip{border:0;background:transparent;display:inline-flex;align-items:center;gap:5px;margin:3px 7px 3px 0;cursor:pointer;font-size:12px;font-weight:850}.eliminate-chip.out{opacity:.42;text-decoration:line-through}.empty{display:grid;place-items:center;text-align:center;padding:58px 20px;color:var(--faint);font-weight:800}.empty svg{width:42px;height:42px;margin-bottom:12px;opacity:.6}.overlay{position:fixed;inset:0;background:rgba(7,16,29,.46);backdrop-filter:blur(8px);z-index:200;display:grid;place-items:center;padding:20px}.modal{width:min(470px,100%);max-height:90vh;overflow:auto;background:#fff;border-radius:28px;box-shadow:0 32px 85px rgba(0,0,0,.25);padding:28px}.modal-title{display:flex;align-items:center;gap:10px;font-size:23px;font-weight:950;letter-spacing:-.04em;margin-bottom:6px}.modal-title svg{width:22px;color:var(--green)}.modal-sub{color:var(--muted);font-size:13px;line-height:1.5;font-weight:650;margin-bottom:22px}.profile-head{display:flex;align-items:center;gap:18px;padding-bottom:20px;border-bottom:1px solid var(--line);margin-bottom:18px}.profile-name{font-size:25px;font-weight:950;letter-spacing:-.045em}.profile-points{font-family:var(--font-display);font-size:37px;font-weight:800;color:var(--green);line-height:1;margin-top:5px}.profile-stats{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--line);border-radius:18px;overflow:hidden;margin-bottom:18px}.profile-stat{padding:14px;text-align:center}.profile-stat+.profile-stat{border-left:1px solid var(--line)}.checkbox{display:flex;align-items:center;gap:10px;margin-bottom:15px;color:var(--muted);font-weight:850;font-size:13px}.checkbox input{width:18px;height:18px;accent-color:var(--green)}.mobile-nav{display:none}
@media(max-width:1200px){.hero-content{grid-template-columns:1fr}.dashboard-grid{grid-template-columns:1fr}.stand-sticky{position:static}.metric-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:900px){:root{--side:260px}.hero h1{font-size:34px}.hero-metrics{grid-template-columns:repeat(2,1fr)}.vote-grid{grid-template-columns:1fr}.topbar{padding:0 18px}.page{padding:22px 18px 86px}.sidebar{transform:translateX(-100%);transition:.22s ease}.sidebar.open{transform:translateX(0)}.side-footer{padding-bottom:calc(92px + env(safe-area-inset-bottom))}.main{margin-left:0}.mobile-menu{display:grid}.top-actions .signin-top{display:none}.mobile-nav{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:60;background:rgba(255,255,255,.94);backdrop-filter:blur(14px);border-top:1px solid var(--line);padding:7px 4px 9px;box-shadow:0 -14px 34px rgba(9,17,32,.08)}.mobile-nav-item{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;background:transparent;color:var(--faint);font-size:9.5px;font-weight:950;cursor:pointer}.mobile-nav-item svg{width:21px;height:21px}.mobile-nav-item.active{color:var(--green)}}@media(max-width:640px){.top-title{font-size:19px}.top-subtitle{display:none}.sync{padding:8px 10px}.sync span:not(.status-dot){display:none}.hero{padding:22px;border-radius:25px}.hero h1{font-size:30px}.hero-copy{font-size:14px}.hero-content{gap:16px}.metric-grid{grid-template-columns:1fr}.match-card{grid-template-columns:1fr;gap:12px}.team.right{flex-direction:row}.team-name.right{text-align:left}.team-owner.right{flex-direction:row}.match-mid{order:-1;align-items:flex-start;min-width:0}.player-grid{grid-template-columns:1fr}.search{min-width:100%;width:100%}.filter-row{align-items:stretch}.vote-options{grid-template-columns:1fr}.panel-head,.section-head{align-items:flex-start;flex-direction:column}.hero-mini-value{font-size:21px}}
.onbehalf{margin-top:14px;padding-top:14px;border-top:1px dashed var(--line-strong)}.onbehalf-label{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.07em;color:var(--blue);margin-bottom:9px}.onbehalf-label svg{width:13px;height:13px}.onbehalf-btns{display:flex;flex-wrap:wrap;gap:7px}.ob-btn{display:inline-flex;align-items:center;gap:5px;border:1.5px solid var(--blue-soft);background:var(--blue-soft);color:var(--blue);border-radius:11px;padding:7px 11px;font-size:12px;font-weight:850;cursor:pointer;transition:.14s;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ob-btn:hover{background:var(--blue);color:#fff;border-color:var(--blue)}.ob-btn svg{width:13px;height:13px;flex:0 0 auto}
.fan-grid{display:grid;grid-template-columns:minmax(0,390px) minmax(0,1fr);gap:22px;align-items:start}.fan-match-list{display:flex;flex-direction:column;gap:8px;padding:8px}.fan-match-btn{width:100%;display:flex;align-items:center;justify-content:space-between;gap:12px;text-align:left;border-radius:16px;background:transparent;padding:12px;cursor:pointer;color:var(--ink);transition:.15s}.fan-match-btn:hover{background:var(--surface-soft)}.fan-match-btn.active{background:linear-gradient(135deg,var(--green-soft),#fff);box-shadow:inset 0 0 0 1px var(--green-line)}.fan-match-main{min-width:0}.fan-match-teams{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:950;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.fan-match-meta{margin-top:5px;color:var(--faint);font-size:11px;font-weight:850}.fan-count{display:inline-flex;align-items:center;gap:5px;border-radius:999px;background:#fff;border:1px solid var(--line);padding:5px 9px;color:var(--muted);font-size:11px;font-weight:950;flex:0 0 auto}.fan-count svg{width:13px;height:13px;color:var(--green)}.fan-room{display:flex;flex-direction:column;min-height:620px}.fan-room-head{padding:18px 20px;border-bottom:1px solid var(--line);background:linear-gradient(180deg,#fff,rgba(247,249,252,.85))}.fan-room-title{display:flex;align-items:center;gap:9px;font-size:20px;font-weight:950;letter-spacing:-.04em}.fan-room-title .vs{font-size:12px;letter-spacing:.1em;color:var(--faint)}.fan-room-sub{margin-top:7px;color:var(--muted);font-size:12.5px;font-weight:750}.fan-feed{flex:1;display:flex;flex-direction:column;gap:12px;padding:18px 20px;background:linear-gradient(180deg,rgba(245,247,250,.42),rgba(255,255,255,.8));max-height:560px;overflow:auto}.fan-msg{display:grid;grid-template-columns:auto minmax(0,1fr);gap:11px;align-items:start}.fan-bubble{background:#fff;border:1px solid var(--line);border-radius:18px;padding:12px 13px;box-shadow:var(--shadow-xs);min-width:0}.fan-msg.wish .fan-bubble{border-color:var(--green-line);background:linear-gradient(180deg,#fff,var(--green-soft))}.fan-msg.prediction .fan-bubble{border-color:#f1d7a5;background:linear-gradient(180deg,#fff,var(--amber-soft))}.fan-meta{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:5px}.fan-author{font-size:12px;font-weight:950;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.fan-time{font-size:10.5px;color:var(--faint);font-weight:850;white-space:nowrap}.fan-text{font-size:14px;line-height:1.45;font-weight:650;overflow-wrap:anywhere}.fan-kind{display:inline-flex;align-items:center;gap:5px;margin-top:8px;border-radius:999px;padding:4px 8px;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.06em;background:var(--surface-soft);color:var(--muted)}.fan-kind.wish{background:var(--green-soft);color:var(--green-dark)}.fan-kind.prediction{background:var(--amber-soft);color:var(--amber)}.fan-actions{display:flex;justify-content:flex-end;gap:6px;margin-top:8px}.fan-delete{display:inline-flex;align-items:center;gap:5px;background:var(--red-soft);color:var(--red);border-radius:9px;padding:5px 8px;font-size:11px;font-weight:900;cursor:pointer}.fan-delete svg{width:12px;height:12px}.fan-compose{padding:16px 20px;border-top:1px solid var(--line);background:#fff}.fan-compose-top{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px}.fan-type{border:1.5px solid var(--line-strong);background:#fff;color:var(--muted);border-radius:999px;padding:7px 11px;font-size:12px;font-weight:950;cursor:pointer}.fan-type.active{background:var(--green-soft);border-color:var(--green-line);color:var(--green-dark)}.fan-send{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:end}.fan-note{margin-top:9px;color:var(--faint);font-size:11px;font-weight:750}.fan-empty{min-height:220px;display:grid;place-items:center;text-align:center;color:var(--muted);font-weight:850}.fan-empty svg{width:30px;height:30px;color:var(--green);margin:0 auto 10px}
.live-screen{position:fixed;inset:0;z-index:300;display:flex;flex-direction:column;color:#eaf2f7;font-family:var(--font-body);touch-action:manipulation;overflow:hidden;-webkit-font-smoothing:antialiased;padding:calc(env(safe-area-inset-top) + 26px) calc(env(safe-area-inset-right) + 42px) calc(env(safe-area-inset-bottom) + 22px) calc(env(safe-area-inset-left) + 42px);background:radial-gradient(120% 80% at 82% -12%,rgba(39,224,140,.16),transparent 55%),radial-gradient(95% 75% at -5% 112%,rgba(48,104,236,.2),transparent 55%),linear-gradient(180deg,#0a1120,#070c16 62%,#060a12)}
.live-screen::after{content:"";position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(rgba(255,255,255,.03) 1px,transparent 1px);background-size:3px 3px;mix-blend-mode:overlay;opacity:.6}
.live-top{display:flex;align-items:center;gap:18px;flex:0 0 auto;z-index:1}
.live-brand{display:flex;align-items:center;gap:14px}.live-mark{width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:linear-gradient(135deg,#27e08c,#0a8a52);box-shadow:0 12px 32px rgba(39,224,140,.42)}.live-mark svg{width:25px;height:25px;color:#04130c}
.live-bt{font-family:var(--font-display);font-weight:800;letter-spacing:-.02em;font-size:clamp(17px,1.5vw,24px);line-height:1}.live-bt small{display:block;font-family:var(--font-body);font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;color:#7fa0b8;font-weight:700;margin-top:4px}
.live-pill{display:inline-flex;align-items:center;gap:9px;padding:9px 16px;border-radius:999px;font-weight:800;font-size:13px;letter-spacing:.14em;text-transform:uppercase;background:rgba(226,51,79,.16);color:#ff7088;border:1px solid rgba(226,51,79,.4)}.live-pill .status-dot{background:#ff5872;box-shadow:0 0 0 5px rgba(226,51,79,.18)}.live-pill.idle{background:rgba(39,224,140,.12);color:#5ff0aa;border-color:rgba(39,224,140,.35)}.live-pill.idle .status-dot{background:#27e08c;box-shadow:0 0 0 5px rgba(39,224,140,.16)}
.live-clock{margin-left:auto;font-family:var(--font-display);font-variant-numeric:tabular-nums;font-weight:700;font-size:clamp(16px,1.4vw,23px);color:#cfe0ec}
.live-exit{width:48px;height:48px;border-radius:15px;display:grid;place-items:center;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);color:#cfe0ec;cursor:pointer;transition:background .16s,color .16s}.live-exit:hover{background:rgba(255,255,255,.15);color:#fff}.live-exit svg{width:23px;height:23px}
.live-stage{flex:1;min-height:0;overflow:hidden;display:flex;flex-direction:column;justify-content:safe center;padding:clamp(10px,2.4vh,34px) 0;z-index:1}
.live-kicker{display:flex;align-items:center;gap:13px;font-size:clamp(12px,1.1vw,16px);font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#6f93ac;margin-bottom:clamp(16px,3vh,32px)}.live-kicker svg{width:20px;height:20px;color:#27e08c}.live-kicker .line{flex:1;height:1px;background:linear-gradient(90deg,rgba(127,160,184,.4),transparent)}
.scene-in{animation:sceneIn .55s cubic-bezier(.16,1,.3,1) both}@keyframes sceneIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
.lv-matches{display:grid;gap:clamp(12px,1.8vh,20px)}
.lv-match{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:clamp(16px,3vw,46px);padding:clamp(14px,2.3vh,26px) clamp(20px,2.4vw,38px);border-radius:22px;background:linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.08)}
.lv-match.is-live{border-color:rgba(226,51,79,.45);background:linear-gradient(180deg,rgba(226,51,79,.12),rgba(255,255,255,.02));box-shadow:0 0 60px rgba(226,51,79,.1)}
.lv-team{display:flex;align-items:center;gap:clamp(12px,1.4vw,22px);min-width:0}.lv-team.right{flex-direction:row-reverse;text-align:right}
.lv-flag{width:clamp(44px,4vw,72px);height:clamp(33px,3vw,54px);border-radius:8px;object-fit:cover;box-shadow:0 6px 18px rgba(0,0,0,.45);flex:0 0 auto}
.lv-tname{font-family:var(--font-display);font-weight:800;font-size:clamp(22px,2.6vw,46px);letter-spacing:-.03em;line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.lv-owner{display:flex;align-items:center;gap:7px;margin-top:9px;font-size:clamp(12px,1vw,16px);font-weight:700;color:#8fb0c8}.lv-team.right .lv-owner{flex-direction:row-reverse}.lv-owner svg{width:16px;height:16px}
.lv-mid{display:flex;flex-direction:column;align-items:center;gap:9px;min-width:clamp(120px,12vw,200px)}
.lv-score{font-family:var(--font-display);font-variant-numeric:tabular-nums;font-weight:800;font-size:clamp(40px,5.4vw,94px);line-height:.9;letter-spacing:.02em}.lv-score .dash{color:#56728a;padding:0 .12em}
.lv-vs{font-family:var(--font-display);font-weight:700;font-size:clamp(20px,2vw,34px);color:#56728a;letter-spacing:.1em}
.lv-tag{font-size:clamp(11px,.85vw,14px);font-weight:800;letter-spacing:.16em;text-transform:uppercase;padding:5px 13px;border-radius:999px}.lv-tag.live{background:rgba(226,51,79,.2);color:#ff7a90}.lv-tag.ft{background:rgba(39,224,140,.16);color:#5ff0aa}.lv-tag.soon{background:rgba(255,255,255,.08);color:#9fb4c6}
.lv-board{display:grid;gap:clamp(5px,.8vh,10px)}
.lv-row{display:flex;align-items:center;gap:clamp(12px,1.5vw,24px);padding:clamp(6px,1vh,12px) clamp(16px,2vw,28px);border-radius:16px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.06)}.lv-row.lead{background:linear-gradient(90deg,rgba(39,224,140,.18),rgba(255,255,255,.02));border-color:rgba(39,224,140,.4)}
.lv-rank{font-family:var(--font-display);font-variant-numeric:tabular-nums;font-weight:800;font-size:clamp(20px,2vw,34px);width:clamp(36px,3.4vw,56px);color:#6f8ba1;flex:0 0 auto}.lv-row.lead .lv-rank{color:#27e08c}
.lv-pname{font-family:var(--font-display);font-weight:800;font-size:clamp(18px,1.9vw,32px);letter-spacing:-.02em;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lv-flags{display:flex;gap:6px;flex:0 0 auto}.lv-flags img{width:clamp(22px,1.7vw,30px);height:clamp(22px,1.7vw,30px);border-radius:999px;object-fit:cover}
.lv-ava{border-radius:999px;display:grid;place-items:center;color:#fff;font-family:var(--font-display);font-weight:800;overflow:hidden;flex:0 0 auto;box-shadow:0 4px 14px rgba(0,0,0,.4);line-height:1}.lv-ava img{width:100%;height:100%;object-fit:cover}.lv-ava.row{width:clamp(34px,2.8vw,48px);height:clamp(34px,2.8vw,48px);font-size:clamp(15px,1.4vw,22px)}.lv-ava.own{width:clamp(24px,1.9vw,32px);height:clamp(24px,1.9vw,32px);font-size:clamp(11px,.95vw,15px)}
.lv-pts{font-family:var(--font-display);font-variant-numeric:tabular-nums;font-weight:800;font-size:clamp(24px,2.5vw,44px);min-width:clamp(66px,6vw,108px);text-align:right;flex:0 0 auto;line-height:1}.lv-pts small{display:block;font-family:var(--font-body);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:#6f8ba1;font-weight:700;margin-top:4px}
.lv-updates{display:grid;gap:clamp(14px,2vh,22px);max-width:1180px;width:100%;margin:0 auto}
.lv-update{display:flex;gap:clamp(16px,1.6vw,24px);align-items:flex-start;padding:clamp(18px,2.3vh,30px);border-radius:22px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07)}.lv-update .ic{width:clamp(46px,3.4vw,60px);height:clamp(46px,3.4vw,60px);border-radius:16px;display:grid;place-items:center;background:rgba(39,224,140,.16);color:#5ff0aa;flex:0 0 auto}.lv-update .ic svg{width:48%;height:48%}
.lv-utext{font-size:clamp(18px,1.7vw,30px);font-weight:600;line-height:1.45;text-wrap:pretty}.lv-udate{font-size:clamp(12px,.95vw,15px);font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#6f8ba1;margin-top:9px}
.live-foot{flex:0 0 auto;display:flex;align-items:center;gap:18px;z-index:1;padding-top:15px;border-top:1px solid rgba(255,255,255,.07)}
.live-dots{display:flex;gap:10px}.live-dot{height:6px;width:30px;border-radius:999px;background:rgba(255,255,255,.16);overflow:hidden;position:relative}.live-dot.on::after{content:"";position:absolute;inset:0;background:#27e08c;transform-origin:left;animation:dotfill var(--scene-ms,10000ms) linear both}@keyframes dotfill{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.live-foot-label{font-size:12.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#6f8ba1}.live-meta{margin-left:auto;display:flex;gap:20px;font-size:13px;font-weight:700;color:#7fa0b8;font-variant-numeric:tabular-nums}.live-meta b{color:#cfe0ec}
@media(max-width:760px){.fan-grid{display:flex;flex-direction:column}.fan-room{order:-1;min-height:0}.fan-feed{max-height:280px}.fan-match-list{max-height:260px;overflow:auto}.fan-send{grid-template-columns:1fr}.lv-match{grid-template-columns:1fr;gap:14px;text-align:center}.lv-team,.lv-team.right{flex-direction:column;text-align:center}.lv-mid{order:-1}.live-meta{display:none}}
`;

const APPROVED = ["Sangay", "Advanced", "Tandin", "Roshan", "Chirag", "Mani", "Kyunchab", "Lhendup", "Buddy", "Manish", "Khorlo", "Cheche", "Zig", "Nirpa", "Lambu", "Tashi"];
const ADMIN_PIN = "admin123";

const ISO = {
  Mexico: "mx", "South Africa": "za", "South Korea": "kr", Czechia: "cz", Canada: "ca", Bosnia: "ba",
  Qatar: "qa", Switzerland: "ch", USA: "us", Paraguay: "py", Brazil: "br", Morocco: "ma", Haiti: "ht",
  Scotland: "gb-sct", Germany: "de", "Curacao": "cw", "Ivory Coast": "ci", Ecuador: "ec", Netherlands: "nl",
  Japan: "jp", Spain: "es", "Cabo Verde": "cv", "Saudi Arabia": "sa", Uruguay: "uy", Belgium: "be", Egypt: "eg",
  Iran: "ir", "New Zealand": "nz", France: "fr", Senegal: "sn", Norway: "no", Iraq: "iq", Argentina: "ar",
  Algeria: "dz", Austria: "at", Jordan: "jo", Portugal: "pt", Congo: "cd", Uzbekistan: "uz", Colombia: "co",
  England: "gb-eng", Croatia: "hr", Ghana: "gh", Panama: "pa", Sweden: "se", Tunisia: "tn", Turkey: "tr", Australia: "au",
};

const COLORS = {
  Sangay: "#5B8DD6", Advanced: "#D14B4B", Tandin: "#2E5FB0", Roshan: "#C44D58", Chirag: "#3A9B5C",
  Mani: "#15A05A", Kyunchab: "#C0392B", Lhendup: "#E07B39", Buddy: "#C9A227", Manish: "#D4AF37",
  Khorlo: "#E06666", Cheche: "#D4B106", Zig: "#1E8E5A", Nirpa: "#1AA260", Lambu: "#5B9BD5", Tashi: "#4A55A8",
};

const SEED_PLAYERS = [
  { id: 1, name: "Sangay", countries: ["Argentina", "Ivory Coast", "Paraguay"] },
  { id: 2, name: "Advanced", countries: ["Spain", "Canada", "Qatar"] },
  { id: 3, name: "Tandin", countries: ["France", "South Korea", "Haiti"] },
  { id: 4, name: "Roshan", countries: ["England", "Austria", "South Africa"] },
  { id: 5, name: "Chirag", countries: ["Portugal", "Sweden", "Curacao"] },
  { id: 6, name: "Mani", countries: ["Brazil", "Japan", "Congo"] },
  { id: 7, name: "Kyunchab", countries: ["Morocco", "Egypt", "Scotland"] },
  { id: 8, name: "Lhendup", countries: ["Netherlands", "Panama", "Jordan"] },
  { id: 9, name: "Buddy", countries: ["Belgium", "Turkey", "Saudi Arabia"] },
  { id: 10, name: "Manish", countries: ["Germany", "Iran", "Iraq"] },
  { id: 11, name: "Khorlo", countries: ["Croatia", "Ecuador", "Cabo Verde"] },
  { id: 12, name: "Cheche", countries: ["Colombia", "Australia", "Uzbekistan"] },
  { id: 13, name: "Zig", countries: ["Mexico", "Czechia", "New Zealand"] },
  { id: 14, name: "Nirpa", countries: ["Senegal", "Switzerland", "Ghana"] },
  { id: 15, name: "Lambu", countries: ["Uruguay", "Algeria", "Tunisia"] },
  { id: 16, name: "Tashi", countries: ["USA", "Norway", "Bosnia"] },
].map((p) => ({ ...p, pts: 0, w: 0, d: 0, l: 0, elim: [], avatar: null, _bonus: 0 }));

const SEED_MATCHES = [
  { id: 1, a: "Mexico", b: "South Africa", date: "2026-06-11", time: "15:00 ET", status: "upcoming", sa: null, sb: null, stage: "Group A" },
  { id: 2, a: "South Korea", b: "Czechia", date: "2026-06-11", time: "22:00 ET", status: "upcoming", sa: null, sb: null, stage: "Group A" },
  { id: 3, a: "Canada", b: "Bosnia", date: "2026-06-12", time: "15:00 ET", status: "upcoming", sa: null, sb: null, stage: "Group B" },
  { id: 5, a: "USA", b: "Paraguay", date: "2026-06-12", time: "21:00 ET", status: "upcoming", sa: null, sb: null, stage: "Group D" },
  { id: 4, a: "Qatar", b: "Switzerland", date: "2026-06-13", time: "00:00 ET", status: "upcoming", sa: null, sb: null, stage: "Group B" },
  { id: 6, a: "Brazil", b: "Morocco", date: "2026-06-13", time: "15:00 ET", status: "upcoming", sa: null, sb: null, stage: "Group C" },
  { id: 7, a: "Haiti", b: "Scotland", date: "2026-06-13", time: "21:00 ET", status: "upcoming", sa: null, sb: null, stage: "Group C" },
  { id: 8, a: "Germany", b: "Curacao", date: "2026-06-14", time: "13:00 ET", status: "upcoming", sa: null, sb: null, stage: "Group E" },
  { id: 9, a: "Ivory Coast", b: "Ecuador", date: "2026-06-14", time: "16:00 ET", status: "upcoming", sa: null, sb: null, stage: "Group E" },
  { id: 10, a: "Netherlands", b: "Japan", date: "2026-06-14", time: "19:00 ET", status: "upcoming", sa: null, sb: null, stage: "Group F" },
  { id: 11, a: "Spain", b: "Cabo Verde", date: "2026-06-15", time: "12:00 ET", status: "upcoming", sa: null, sb: null, stage: "Group H" },
  { id: 13, a: "Belgium", b: "Egypt", date: "2026-06-15", time: "15:00 ET", status: "upcoming", sa: null, sb: null, stage: "Group G" },
  { id: 12, a: "Saudi Arabia", b: "Uruguay", date: "2026-06-15", time: "18:00 ET", status: "upcoming", sa: null, sb: null, stage: "Group H" },
  { id: 14, a: "Iran", b: "New Zealand", date: "2026-06-15", time: "21:00 ET", status: "upcoming", sa: null, sb: null, stage: "Group G" },
  { id: 15, a: "France", b: "Senegal", date: "2026-06-16", time: "15:00 ET", status: "upcoming", sa: null, sb: null, stage: "Group I" },
  { id: 16, a: "Norway", b: "Iraq", date: "2026-06-16", time: "18:00 ET", status: "upcoming", sa: null, sb: null, stage: "Group I" },
  { id: 17, a: "Argentina", b: "Algeria", date: "2026-06-16", time: "21:00 ET", status: "upcoming", sa: null, sb: null, stage: "Group J" },
  { id: 18, a: "Austria", b: "Jordan", date: "2026-06-17", time: "00:00 ET", status: "upcoming", sa: null, sb: null, stage: "Group J" },
  { id: 19, a: "Portugal", b: "Congo", date: "2026-06-17", time: "13:00 ET", status: "upcoming", sa: null, sb: null, stage: "Group K" },
  { id: 21, a: "England", b: "Croatia", date: "2026-06-17", time: "21:00 ET", status: "upcoming", sa: null, sb: null, stage: "Group L" },
  { id: 20, a: "Uzbekistan", b: "Colombia", date: "2026-06-17", time: "22:00 ET", status: "upcoming", sa: null, sb: null, stage: "Group K" },
  { id: 22, a: "Ghana", b: "Panama", date: "2026-06-18", time: "00:00 ET", status: "upcoming", sa: null, sb: null, stage: "Group L" },
];

const SEED_ANN = [
  { id: 1, text: "Welcome to the DHI InnoTech World Cup pool: 16 colleagues, 48 countries, one department scoreboard.", date: "Jun 11" },
  { id: 2, text: "Opening office clash: Mexico vs South Africa - Zig vs Roshan starts the race.", date: "Jun 11" },
];

const SEED_POLLS = [
  { id: 1, q: "Who lifts the trophy?", opts: ["Mani - Brazil", "Advanced - Spain", "Chirag - Portugal", "Sangay - Argentina"] },
  { id: 2, q: "Toughest group draw?", opts: ["Mani - Group C", "Tandin - Group I", "Lhendup - Group F", "Roshan - Group L"] },
  { id: 3, q: "Best opening-day clash?", opts: ["Mexico v South Africa", "South Korea v Czechia", "Tomorrow's fixtures", "All of them"] },
];

const SCORING = [["Group Win", "3"], ["Draw", "1"], ["Round of 32", "3"], ["Round of 16", "5"], ["Quarter-final", "8"], ["Semi-final", "12"], ["Final", "18"], ["Champion", "25"]];
// ESPN's public scoreboard API (proxied same-origin by vite.config.js -> no CORS).
// Accurate, real-time scores/status for the whole tournament window.
const API = { enabled: true, url: "/api/espn/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260611-20260719&limit=300", headers: {}, refreshMs: 45000, timeoutMs: 20000, retryMs: 6000 };
const STORAGE_KEY = "dhi-office-world-cup:v2";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const FAN_TABLE = "fan_comments";
const FAN_API = "/api/fan-comments";
const STATE_API = "/api/app-state";
const USER_KEY = "dhi-office-world-cup:user";
const TAB_KEY = "dhi-office-world-cup:tab";

const NAV = [
  ["dashboard", "Dashboard", LayoutGrid],
  ["leaderboard", "Leaderboard", Trophy],
  ["schedule", "Schedule", CalendarDays],
  ["players", "Players", Users],
  ["voting", "Voting", Vote],
  ["fanzone", "Fan Zone", ChatCircleText],
  ["admin", "Admin", Settings2],
];

const SUBTITLE = {
  dashboard: "Live tournament pulse",
  leaderboard: "Standings & points",
  schedule: "Fixtures by day",
  players: "Squads & owners",
  voting: "Predictions & polls",
  fanzone: "Match wishes & live comments",
  admin: "Organizer controls",
};

const NAME_MAP = {
  "United States": "USA", US: "USA", "Korea Republic": "South Korea", "Republic of Korea": "South Korea", Korea: "South Korea",
  "Czech Republic": "Czechia", "Cape Verde": "Cabo Verde", "Cote d'Ivoire": "Ivory Coast",
  "DR Congo": "Congo", "Congo DR": "Congo", "Democratic Republic of the Congo": "Congo", "Bosnia and Herzegovina": "Bosnia",
  "Bosnia & Herzegovina": "Bosnia", "Bosnia-Herzegovina": "Bosnia", Curacao: "Curacao", Turkiye: "Turkey",
};

const normalizeName = (name) => {
  if (!name) return "";
  const trimmed = String(name).trim();
  return NAME_MAP[trimmed] || trimmed;
};

function sanitizeText(value) {
  if (typeof value !== "string") return value;
  return value
    .replaceAll("Cura\u00c3\u00a7ao", "Curacao")
    .replaceAll("Cura\u00e7ao", "Curacao")
    .replaceAll("C\u00c3\u00b4te d'Ivoire", "Cote d'Ivoire")
    .replaceAll("T\u00c3\u00bcrkiye", "Turkiye")
    .replaceAll("\u00c2\u00b7", "-")
    .replaceAll("\u00e2\u20ac\u201d", "-")
    .replaceAll("\u00e2\u20ac\u201c", "-")
    .replaceAll("\u00e2\u20ac\u00a6", "...")
    .replaceAll("\u00e2\u2020\u2019", "->")
    .replaceAll("\u00c3\u2014", "x");
}

function sanitizeData(value) {
  if (Array.isArray(value)) return value.map(sanitizeData);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sanitizeData(item)]));
  return sanitizeText(value);
}

const sameData = (a, b) => a === b || JSON.stringify(a) === JSON.stringify(b);

const toScore = (value) => {
  if (value == null) return null;
  const parsed = Number.parseInt(String(value).trim(), 10);
  return Number.isFinite(parsed) ? parsed : null;
};

// ESPN scoreboard: { events: [{ competitions:[{ competitors:[{homeAway,score,team:{displayName}}] }], status:{type:{state}} }] }
function parseEspn(events) {
  return events
    .map((event) => {
      const comp = event.competitions?.[0];
      const teams = comp?.competitors || [];
      const home = teams.find((t) => t.homeAway === "home") || teams[0];
      const away = teams.find((t) => t.homeAway === "away") || teams[1];
      if (!home || !away) return null;
      const state = event.status?.type?.state; // pre | in | post
      const status = state === "in" ? "live" : state === "post" ? "completed" : "upcoming";
      return {
        home: normalizeName(home.team?.displayName),
        away: normalizeName(away.team?.displayName),
        homeScore: toScore(home.score),
        awayScore: toScore(away.score),
        status,
      };
    })
    .filter((m) => m && m.home && m.away);
}

function parseResponse(raw) {
  return Array.isArray(raw?.events) ? parseEspn(raw.events) : [];
}

function safeDate(dateString) {
  const [y, m, d] = dateString.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function fmtDate(dateString, options = { weekday: "short", month: "short", day: "numeric" }) {
  return safeDate(dateString).toLocaleDateString("en-US", options);
}

function flagUrl(country, big = false) {
  const code = ISO[country];
  if (!code) return null;
  return code.includes("-")
    ? `https://hatscripts.github.io/circle-flags/flags/${code}.svg`
    : `https://flagcdn.com/${big ? "w160" : "w80"}/${code}.png`;
}

function getOwner(country, players) {
  return players.find((p) => p.countries.includes(country));
}

function getActiveCountries(player) {
  return player.countries.filter((country) => !player.elim.includes(country));
}

function comparePlayers(a, b) {
  return b.pts - a.pts || b.w - a.w || getActiveCountries(b).length - getActiveCountries(a).length || a.name.localeCompare(b.name);
}

function formOf(player) {
  const form = [];
  for (let i = 0; i < player.w; i += 1) form.push("W");
  for (let i = 0; i < player.d; i += 1) form.push("D");
  for (let i = 0; i < player.l; i += 1) form.push("L");
  return form.slice(-5).reverse();
}

function computePlayers(players, matches) {
  return players.map((player) => {
    let w = 0;
    let d = 0;
    let l = 0;
    let pts = 0;
    matches.forEach((match) => {
      if (match.status !== "completed" || match.sa == null || match.sb == null) return;
      const ownsA = player.countries.includes(match.a);
      const ownsB = player.countries.includes(match.b);
      if (!ownsA && !ownsB) return;
      const ownScore = ownsA ? match.sa : match.sb;
      const opponentScore = ownsA ? match.sb : match.sa;
      if (ownScore > opponentScore) {
        w += 1;
        pts += 3;
      } else if (ownScore === opponentScore) {
        d += 1;
        pts += 1;
      } else {
        l += 1;
      }
    });
    return { ...player, w, d, l, pts: pts + (Number(player._bonus) || 0) };
  });
}

function storageAvailable() {
  return typeof window !== "undefined";
}

const supabaseReady = () => Boolean(SUPABASE_URL && SUPABASE_KEY);
const hostedFanApiReady = () => {
  if (typeof window === "undefined") return false;
  return !["localhost", "127.0.0.1"].includes(window.location.hostname);
};
const hostedStateApiReady = hostedFanApiReady;

async function loadState() {
  if (!storageAvailable()) return null;
  try {
    if (hostedStateApiReady()) {
      const response = await fetch(STATE_API, { headers: { Accept: "application/json" } });
      if (!response.ok) return null;
      return response.json();
    }
    if (window.storage?.get) {
      const response = await window.storage.get(STORAGE_KEY, true);
      return response?.value ? JSON.parse(response.value) : null;
    }
    const value = window.localStorage?.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

async function saveState(state) {
  if (!storageAvailable()) return false;
  try {
    const cleanState = { ...state };
    delete cleanState.fanComments;
    if (hostedStateApiReady()) {
      const response = await fetch(STATE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanState),
      });
      return response.ok;
    }
    const payload = JSON.stringify({ ...cleanState, updatedAt: Date.now() });
    if (window.storage?.set) await window.storage.set(STORAGE_KEY, payload, true);
    else window.localStorage?.setItem(STORAGE_KEY, payload);
    return true;
  } catch {
    return false;
  }
}

function loadLocalUser() {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage?.getItem(USER_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function saveLocalUser(user) {
  if (typeof window === "undefined") return;
  try {
    if (user) window.localStorage?.setItem(USER_KEY, JSON.stringify(user));
    else window.localStorage?.removeItem(USER_KEY);
  } catch {
    // Identity remains available for this session if browser storage is blocked.
  }
}

function loadSavedTab() {
  if (typeof window === "undefined") return "dashboard";
  const fromHash = window.location.hash?.replace(/^#\/?/, "");
  const fromStorage = window.localStorage?.getItem(TAB_KEY);
  const tab = fromHash || fromStorage || "dashboard";
  return NAV.some(([id]) => id === tab) ? tab : "dashboard";
}

function saveCurrentTab(tab) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage?.setItem(TAB_KEY, tab);
    if (window.location.hash !== `#${tab}`) window.history.replaceState(null, "", `#${tab}`);
  } catch {
    // The active tab still works for this session if browser storage is blocked.
  }
}

function mergeFanLists(previous, remote) {
  const remoteIds = new Set(remote.map((item) => String(item.id)));
  const localPending = previous.filter((item) => String(item.id).startsWith("temp-") || item.localOnly);
  return [...localPending.filter((item) => !remoteIds.has(String(item.id))), ...remote];
}

const fanHeaders = () => ({
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
});

const fromFanRow = (row) => ({
  id: row.id,
  matchId: row.match_id,
  type: row.type,
  text: row.text,
  author: row.author,
  role: row.role,
  hidden: Boolean(row.hidden),
  createdAt: new Date(row.created_at).getTime(),
});

async function loadFanComments() {
  if (hostedFanApiReady()) {
    const response = await fetch(FAN_API, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("fan comments unavailable");
    return response.json();
  }
  if (!supabaseReady()) return null;
  const url = `${SUPABASE_URL}/rest/v1/${FAN_TABLE}?select=*&order=created_at.desc&limit=500`;
  const response = await fetch(url, { headers: fanHeaders() });
  if (!response.ok) throw new Error("fan comments unavailable");
  return (await response.json()).map(fromFanRow);
}

async function createFanComment(comment) {
  if (hostedFanApiReady()) {
    const response = await fetch(FAN_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    });
    if (!response.ok) throw new Error("fan comment failed");
    return response.json();
  }
  if (!supabaseReady()) return null;
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${FAN_TABLE}`, {
    method: "POST",
    headers: { ...fanHeaders(), Prefer: "return=representation" },
    body: JSON.stringify({
      match_id: comment.matchId,
      type: comment.type,
      text: comment.text,
      author: comment.author,
      role: comment.role,
    }),
  });
  if (!response.ok) throw new Error("fan comment failed");
  const rows = await response.json();
  return rows[0] ? fromFanRow(rows[0]) : null;
}

async function hideFanComment(id) {
  if (hostedFanApiReady()) {
    const response = await fetch(FAN_API, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    return response.ok;
  }
  if (!supabaseReady()) return false;
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${FAN_TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: fanHeaders(),
    body: JSON.stringify({ hidden: true }),
  });
  return response.ok;
}

function useDocumentFont() {
  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const exists = document.querySelector(`link[href="${FONT_HREF}"]`);
    if (exists) return undefined;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONT_HREF;
    document.head.appendChild(link);
    return () => link.remove();
  }, []);
}

function Avatar({ name, size = 38, img }) {
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.42, background: COLORS[name] || "#7b8796" }}>
      {img ? <img src={img} alt={`${name} profile`} /> : name?.slice(0, 1)}
    </div>
  );
}

function readAvatarFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const max = 360;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function Flag({ country, size = 22, round = false }) {
  const url = flagUrl(country, size > 44);
  if (!url) return <span aria-label={`${country} flag`} className="flag-fallback">Flag</span>;
  return (
    <img
      className={`flag ${round ? "round" : "rect"}`}
      src={url}
      alt={`${country} flag`}
      style={{ width: round ? size : size * 1.42, height: size }}
      onError={(event) => {
        event.currentTarget.style.visibility = "hidden";
      }}
    />
  );
}

function StatusTag({ status }) {
  if (status === "live") return <span className="tag live"><span className="status-dot red" />LIVE</span>;
  if (status === "completed") return <span className="tag done">FT</span>;
  return <span className="tag soon">SOON</span>;
}

function SyncStatus({ live, autoMode }) {
  const time = live.lastSync ? live.lastSync.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
  if (!autoMode || live.status === "manual") return <button type="button" className="sync" onClick={live.sync}><WifiOff />Manual</button>;
  if (live.status === "live") return <button type="button" className="sync ok" onClick={live.sync} title={time ? `Synced ${time}` : "Synced"}><span className="status-dot" /><span>Live{time ? ` - ${time}` : ""}</span></button>;
  if (live.status === "connecting" || live.status === "idle") return <div className="sync warn"><RefreshCw className="spin" /><span>Syncing</span></div>;
  return <button type="button" className="sync" onClick={live.sync}><WifiOff /><span>Offline</span></button>;
}

function Metric({ icon: Icon, value, label, note, color = "var(--green)", bg = "var(--green-soft)", small = false }) {
  return (
    <div className="metric">
      <div className="metric-icon" style={{ background: bg }}><Icon style={{ color }} /></div>
      <div className={`metric-value ${small ? "small" : ""}`}>{value}</div>
      <div className="metric-label">{label}</div>
      {note && <div className="metric-note">{note}</div>}
    </div>
  );
}

function MatchCard({ match, players }) {
  const ownerA = getOwner(match.a, players);
  const ownerB = getOwner(match.b, players);
  const clash = ownerA && ownerB && ownerA.id !== ownerB.id;
  const hasScore = match.status !== "upcoming";
  return (
    <div className={`match-card ${clash ? "clash" : ""} ${match.status === "live" ? "live" : ""}`}>
      <div className="team">
        <Flag country={match.a} size={28} />
        <div className="team-meta">
          <div className="team-name">{match.a}</div>
          {ownerA && <div className="team-owner" style={{ color: COLORS[ownerA.name] }}><Avatar name={ownerA.name} size={18} img={ownerA.avatar} />{ownerA.name}</div>}
        </div>
      </div>
      <div className="match-mid">
        <StatusTag status={match.status} />
        {hasScore ? <div className="score">{match.sa ?? "-"} : {match.sb ?? "-"}</div> : <div className="vs">VS</div>}
        <div className="match-time">{match.stage} - {match.time}</div>
        {clash && <div className="clash-note"><Swords />Office clash</div>}
      </div>
      <div className="team right">
        <Flag country={match.b} size={28} />
        <div className="team-meta">
          <div className="team-name right">{match.b}</div>
          {ownerB && <div className="team-owner right" style={{ color: COLORS[ownerB.name] }}><Avatar name={ownerB.name} size={18} img={ownerB.avatar} />{ownerB.name}</div>}
        </div>
      </div>
    </div>
  );
}

function PanelHeader({ icon: Icon, title, action, onAction }) {
  return (
    <div className="panel-head">
      <div className="panel-title"><Icon />{title}</div>
      {action && <button type="button" className="panel-link" onClick={onAction}>{action}<ChevronRight /></button>}
    </div>
  );
}

function Dashboard({ players, matches, announcements, go }) {
  const sorted = useMemo(() => [...players].sort(comparePlayers), [players]);
  const leader = sorted[0];
  const completed = matches.filter((m) => m.status === "completed");
  const live = matches.filter((m) => m.status === "live");
  const upcoming = matches.filter((m) => m.status === "upcoming");
  const focus = live[0] || upcoming[0] || matches[matches.length - 1];
  const focusDay = focus ? matches.filter((m) => m.date === focus.date).slice(0, 5) : [];
  const activeTeams = players.reduce((count, player) => count + getActiveCountries(player).length, 0);

  return (
    <div className="rise">
      <section className="hero">
        <div className="hero-content">
          <div>
            <div className="eyebrow"><Sparkles />World Cup 2026 - Office Pool</div>
            <h1>Race to the crown.</h1>
            <div className="hero-metrics">
              <div className="hero-mini"><div className="hero-mini-value">{players.length}</div><div className="hero-mini-label">Players</div></div>
              <div className="hero-mini"><div className="hero-mini-value">{activeTeams}</div><div className="hero-mini-label">Active teams</div></div>
              <div className="hero-mini"><div className="hero-mini-value">{completed.length}/{matches.length}</div><div className="hero-mini-label">Matches played</div></div>
              <div className="hero-mini"><div className="hero-mini-value">{live.length}</div><div className="hero-mini-label">Live now</div></div>
            </div>
          </div>
          <div className="spotlight">
            <div className="spot-top"><span className="spot-label">Current leader</span><span className="tag admin"><Crown size={12} />Race leader</span></div>
            <div className="spot-card">
              <div className="player-cell">
                <Avatar name={leader?.name} size={58} img={leader?.avatar} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="player-name" style={{ fontSize: 22 }}>{leader?.name || "-"}</div>
                  <div className="player-meta"><Shield />{leader ? getActiveCountries(leader).length : 0} active teams - {leader?.w || 0}W {leader?.d || 0}D {leader?.l || 0}L</div>
                  <div className="flag-row" style={{ marginTop: 10 }}>{leader?.countries.map((country) => <Flag key={country} country={country} size={18} round />)}</div>
                </div>
                <div className="points-block"><strong>{leader?.pts ?? 0}</strong><div className="wdl-label">pts</div></div>
              </div>
              {focus && <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--line)" }}><MatchCard match={focus} players={players} /></div>}
            </div>
          </div>
        </div>
      </section>

      <div className="dashboard-grid">
        <div className="stack">
          <section className="panel">
            <PanelHeader icon={CalendarDays} title={focus ? `${fmtDate(focus.date)} fixtures` : "Fixtures"} action="Full schedule" onAction={() => go("schedule")} />
            <div className="match-list">{focusDay.map((match) => <MatchCard key={match.id} match={match} players={players} />)}</div>
          </section>
          <section className="panel">
            <PanelHeader icon={Megaphone} title="Latest updates" />
            {announcements.length ? announcements.slice(0, 4).map((item) => (
              <div className="announcement" key={item.id}>
                <div className="announcement-icon"><Radio /></div>
                <div><div className="announcement-text">{item.text}</div><div className="announcement-date">{item.date}</div></div>
              </div>
            )) : <div className="empty"><Megaphone />No updates posted yet.</div>}
          </section>
        </div>
        <aside className="panel stand-sticky">
          <PanelHeader icon={Trophy} title="Top standings" action="View all" onAction={() => go("leaderboard")} />
          {sorted.slice(0, 9).map((player, index) => (
            <button type="button" className="stand-row" key={player.id} onClick={() => go("leaderboard")}>
              <span className={`rank ${index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "bronze" : ""}`}>{index + 1}</span>
              <Avatar name={player.name} size={36} img={player.avatar} />
              <div className="stand-info">
                <div className="stand-name">{player.name}</div>
                <div className="mini-flags">{getActiveCountries(player).map((country) => <Flag key={country} country={country} size={15} round />)}</div>
              </div>
              <div className="stand-points"><strong>{player.pts}</strong><span>pts</span></div>
            </button>
          ))}
        </aside>
      </div>
    </div>
  );
}

function Leaderboard({ players }) {
  const sorted = useMemo(() => [...players].sort(comparePlayers), [players]);
  const max = sorted[0]?.pts || 1;
  return (
    <div className="rise">
      <section className="panel table-wrap">
        <table className="leader-table">
          <thead>
            <tr><th style={{ width: 72 }}>Rank</th><th>Player</th><th>Countries</th><th className="right">Form</th><th className="right">W</th><th className="right">D</th><th className="right">L</th><th className="right">Points</th></tr>
          </thead>
          <tbody>
            {sorted.map((player, index) => {
              const active = getActiveCountries(player);
              const form = formOf(player);
              return (
                <tr key={player.id}>
                  <td><div className="player-cell"><span className={`rank ${index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "bronze" : ""}`}>{index + 1}</span>{index === 0 && <Crown size={17} color="var(--gold)" />}{(index === 1 || index === 2) && <Medal size={16} color={index === 1 ? "var(--silver)" : "var(--bronze)"} />}</div></td>
                  <td><div className="player-cell"><span className="color-rail" style={{ background: COLORS[player.name] || "#ccd5df" }} /><Avatar name={player.name} size={42} img={player.avatar} /><div><div className="player-name">{player.name}</div><div className="player-meta"><Shield />{active.length} active{player.elim.length > 0 ? ` - ${player.elim.length} out` : ""}</div></div></div></td>
                  <td><div className="flag-row">{player.countries.map((country) => <span key={country} style={{ opacity: player.elim.includes(country) ? 0.34 : 1 }}><Flag country={country} size={18} round /></span>)}</div></td>
                  <td><div className="form-row">{form.length ? form.map((result, i) => <span key={`${result}-${i}`} className={`form-chip ${result.toLowerCase()}`}>{result}</span>) : <span className="form-chip empty">-</span>}</div></td>
                  <td className="right num">{player.w}</td><td className="right num">{player.d}</td><td className="right num">{player.l}</td>
                  <td><div className="points-block"><strong style={{ color: index === 0 ? "var(--green)" : "var(--ink)" }}>{player.pts}</strong><div className="progress"><span style={{ width: `${Math.max(2, (player.pts / max) * 100)}%`, background: index === 0 ? "var(--green)" : COLORS[player.name] || "var(--blue)" }} /></div></div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
      <div className="scoring">{SCORING.map(([label, value]) => <span key={label}>{label} <b>{value}</b></span>)}</div>
    </div>
  );
}

function Schedule({ matches, players }) {
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => matches.filter((match) => {
    const statusOk = status === "all" || match.status === status;
    const haystack = `${match.a} ${match.b} ${match.stage}`.toLowerCase();
    return statusOk && haystack.includes(query.trim().toLowerCase());
  }), [matches, query, status]);
  const grouped = useMemo(() => filtered.reduce((acc, match) => {
    acc[match.date] = acc[match.date] || [];
    acc[match.date].push(match);
    return acc;
  }, {}), [filtered]);

  return (
    <div className="rise">
      <div className="filter-row">
        <div className="chips">{[["all", "All"], ["live", "Live"], ["upcoming", "Upcoming"], ["completed", "Completed"]].map(([id, label]) => <button type="button" key={id} className={`filter-chip ${status === id ? "active" : ""}`} onClick={() => setStatus(id)}>{label}</button>)}</div>
        <div className="search"><Search /><input className="input" placeholder="Search team or group..." value={query} onChange={(e) => setQuery(e.target.value)} /></div>
      </div>
      {Object.keys(grouped).length ? Object.entries(grouped).map(([date, dayMatches]) => (
        <section className="day" key={date}>
          <div className="day-header"><div className="day-pill"><CalendarDays />{fmtDate(date)}</div><div className="day-line" /><span className="day-count">{dayMatches.length} {dayMatches.length === 1 ? "match" : "matches"}</span></div>
          <div className="panel"><div className="match-list">{dayMatches.map((match) => <MatchCard key={match.id} match={match} players={players} />)}</div></div>
        </section>
      )) : <div className="empty"><CalendarDays />No fixtures match this filter.</div>}
    </div>
  );
}

function PlayersView({ players, me, onAvatar }) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const sorted = useMemo(() => [...players].sort(comparePlayers), [players]);
  const visible = useMemo(() => players.filter((player) => player.name.toLowerCase().includes(query.trim().toLowerCase()) || player.countries.join(" ").toLowerCase().includes(query.trim().toLowerCase())), [players, query]);
  const selected = selectedId ? players.find((player) => player.id === selectedId) : null;

  const uploadAvatar = async (event, id) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const dataUrl = await readAvatarFile(file);
    onAvatar(id, dataUrl);
    event.target.value = "";
  };

  return (
    <div className="rise">
      <div className="section-head">
        <div className="section-title"><Users />{players.length} participants</div>
        <div className="search"><Search /><input className="input" placeholder="Search player or country..." value={query} onChange={(e) => setQuery(e.target.value)} /></div>
      </div>
      <div className="player-grid">
        {visible.map((player) => {
          const rank = sorted.findIndex((item) => item.id === player.id) + 1;
          return (
            <button type="button" className="player-card" key={player.id} onClick={() => setSelectedId(player.id)}>
              <div className="player-card-top">
                <span className="rank-badge">#{rank}</span>
                <Avatar name={player.name} size={58} img={player.avatar} />
                <div style={{ textAlign: "left" }}><div className="card-name">{player.name}</div><div className="card-points"><strong>{player.pts}</strong><span>pts</span></div></div>
              </div>
              <div className="country-chips">{player.countries.map((country) => <span key={country} className={`country-chip ${player.elim.includes(country) ? "out" : ""}`}><Flag country={country} size={15} round />{country}</span>)}</div>
              <div className="wdl-grid">{[["w", player.w, "Won"], ["d", player.d, "Draw"], ["l", player.l, "Lost"]].map(([key, value, label]) => <div className="wdl-box" key={key}><div className={`wdl-value ${key}`}>{value}</div><div className="wdl-label">{label}</div></div>)}</div>
            </button>
          );
        })}
      </div>
      {selected && (
        <div className="overlay" onClick={() => setSelectedId(null)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="profile-head">
              <Avatar name={selected.name} size={76} img={selected.avatar} />
              <div><div className="profile-name">{selected.name}</div><div className="profile-points">{selected.pts}</div><div className="wdl-label">total points</div></div>
            </div>
            <div className="profile-stats">{[["w", selected.w, "Won"], ["d", selected.d, "Draw"], ["l", selected.l, "Lost"]].map(([key, value, label]) => <div className="profile-stat" key={key}><div className={`wdl-value ${key}`} style={{ fontSize: 22 }}>{value}</div><div className="wdl-label">{label}</div></div>)}</div>
            <div className="field"><label>Countries</label><div className="country-chips" style={{ padding: 0, borderTop: 0 }}>{selected.countries.map((country) => <span key={country} className={`country-chip ${selected.elim.includes(country) ? "out" : ""}`}><Flag country={country} size={16} round />{country}</span>)}</div></div>
            {me?.name === selected.name && <div className="field"><label>Update your photo</label><button type="button" className="btn btn-soft" onClick={() => document.getElementById(`avatar-${selected.id}`)?.click()}><Upload />Upload profile image</button><input id={`avatar-${selected.id}`} type="file" accept="image/*" onChange={(event) => uploadAvatar(event, selected.id)} style={{ display: "none" }} /></div>}
            <button type="button" className="btn btn-primary" style={{ width: "100%" }} onClick={() => setSelectedId(null)}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
}

const FAN_TYPES = [
  ["comment", "Comment", ChatCircleText],
  ["wish", "Wish", Heart],
  ["prediction", "Prediction", Target],
];

function commentTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function FanZone({ matches, players, me, comments, onCommentAdd, onCommentDelete }) {
  const orderedMatches = useMemo(() => [...matches].sort((a, b) => {
    const statusWeight = { live: 0, upcoming: 1, completed: 2 };
    return (statusWeight[a.status] ?? 9) - (statusWeight[b.status] ?? 9) || safeDate(a.date) - safeDate(b.date) || a.id - b.id;
  }), [matches]);
  const [selectedId, setSelectedId] = useState(() => orderedMatches[0]?.id ?? null);
  const [type, setType] = useState("comment");
  const [text, setText] = useState("");
  const [guestName, setGuestName] = useState(() => {
    if (typeof window === "undefined") return "";
    try {
      return window.localStorage?.getItem("dhi-office-world-cup:fan-name") || "";
    } catch {
      return "";
    }
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderedMatches.some((match) => match.id === selectedId)) setSelectedId(orderedMatches[0]?.id ?? null);
  }, [orderedMatches, selectedId]);

  const selected = orderedMatches.find((match) => match.id === selectedId) || orderedMatches[0];
  const matchComments = useMemo(() => comments
    .filter((item) => item.matchId === selected?.id && !item.hidden)
    .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0)), [comments, selected?.id]);

  const submit = () => {
    const clean = text.trim().replace(/\s+/g, " ");
    const author = (me?.name || guestName).trim().slice(0, 32);
    if (!selected) {
      setError("Choose a match first.");
      return;
    }
    if (!author) {
      setError("Enter your display name.");
      return;
    }
    if (clean.length < 2) {
      setError("Type a message first.");
      return;
    }
    if (!me && typeof window !== "undefined") {
      try {
        window.localStorage?.setItem("dhi-office-world-cup:fan-name", author);
      } catch {
        // Posting still works for this session if the browser blocks storage.
      }
    }
    onCommentAdd({
      id: Date.now(),
      matchId: selected.id,
      type,
      text: clean.slice(0, 220),
      author,
      role: me?.role || "fan",
      createdAt: Date.now(),
    });
    setText("");
    setError("");
  };

  return (
    <div className="rise">
      <div className="fan-grid">
        <section className="panel">
          <PanelHeader icon={Swords} title="Match rooms" />
          <div className="fan-match-list">
            {orderedMatches.map((match) => {
              const count = comments.filter((item) => item.matchId === match.id && !item.hidden).length;
              return (
                <button type="button" className={`fan-match-btn ${selected?.id === match.id ? "active" : ""}`} key={match.id} onClick={() => setSelectedId(match.id)}>
                  <div className="fan-match-main">
                    <div className="fan-match-teams"><Flag country={match.a} size={16} round />{match.a}<span style={{ color: "var(--faint)" }}>v</span>{match.b}<Flag country={match.b} size={16} round /></div>
                    <div className="fan-match-meta">{fmtDate(match.date)} - {match.stage}</div>
                  </div>
                  <span className="fan-count"><ChatCircleText />{count}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="panel fan-room">
          {selected && (
            <>
              <div className="fan-room-head">
                <div className="fan-room-title"><Flag country={selected.a} size={24} round />{selected.a}<span className="vs">VS</span>{selected.b}<Flag country={selected.b} size={24} round /></div>
                <div className="fan-room-sub">{fmtDate(selected.date)} - {selected.time} - {selected.stage} - {selected.status === "live" ? "Live now" : selected.status === "completed" ? "Full time" : "Upcoming"}</div>
              </div>

              <div className="fan-feed">
                {matchComments.length ? matchComments.map((item) => {
                  const author = players.find((player) => player.name === item.author);
                  return (
                    <article className={`fan-msg ${item.type}`} key={item.id}>
                      <Avatar name={item.author} size={38} img={author?.avatar} />
                      <div className="fan-bubble">
                        <div className="fan-meta"><span className="fan-author">{item.author}</span><span className="fan-time">{commentTime(item.createdAt)}</span></div>
                        <div className="fan-text">{item.text}</div>
                        <span className={`fan-kind ${item.type}`}>{item.type}</span>
                        {me?.role === "admin" && <div className="fan-actions"><button type="button" className="fan-delete" onClick={() => onCommentDelete(item.id)}><Trash2 />Hide</button></div>}
                      </div>
                    </article>
                  );
                }) : <div className="fan-empty"><div><ChatCircleText />No messages yet.</div></div>}
              </div>

              <div className="fan-compose">
                <div className="fan-compose-top">
                  {!me && <input className="input" style={{ maxWidth: 220 }} placeholder="Your display name" value={guestName} onChange={(event) => { setGuestName(event.target.value); setError(""); }} />}
                  {me && <span className="fan-count"><LogIn />{me.name}</span>}
                  {FAN_TYPES.map(([id, label, Icon]) => <button type="button" key={id} className={`fan-type ${type === id ? "active" : ""}`} onClick={() => setType(id)}><Icon size={14} />{label}</button>)}
                </div>
                <div className="fan-send">
                  <textarea className="textarea" maxLength={220} rows={2} placeholder="Send a match comment, wish, or prediction..." value={text} onChange={(event) => { setText(event.target.value); setError(""); }} onKeyDown={(event) => { if ((event.ctrlKey || event.metaKey) && event.key === "Enter") submit(); }} />
                  <button type="button" className="btn btn-primary" onClick={submit}><PaperPlaneTilt />Send</button>
                </div>
                <div className="fan-note" style={{ color: error ? "var(--red)" : "var(--faint)" }}>{error || `${220 - text.length} characters left`}</div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function voteCounts(current = {}) {
  if (current.byUser) return Object.values(current.byUser).reduce((acc, choice) => ({ ...acc, [choice]: (acc[choice] || 0) + 1 }), { A: 0, Draw: 0, B: 0 });
  return { A: current.A || 0, Draw: current.Draw || 0, B: current.B || 0 };
}

function correctChoice(match) {
  if (match.status !== "completed" || match.sa == null || match.sb == null) return null;
  if (match.sa > match.sb) return "A";
  if (match.sb > match.sa) return "B";
  return "Draw";
}

function predictionBoard(players, matches, votes) {
  return players.map((player) => {
    let hits = 0;
    let total = 0;
    matches.forEach((match) => {
      const expected = correctChoice(match);
      const picked = expected ? votes[match.id]?.byUser?.[player.name] : null;
      if (!picked) return;
      total += 1;
      if (picked === expected) hits += 1;
    });
    return { ...player, predictionHits: hits, predictionTotal: total };
  }).sort((a, b) => b.predictionHits - a.predictionHits || b.predictionTotal - a.predictionTotal || a.name.localeCompare(b.name));
}

function Voting({ matches, players, votes, myVotes, me, onVote, polls, customPolls, pollVotes, myPoll, onPoll, onPollCreate, onVoteFor, onPollFor }) {
  const upcoming = matches;
  const canVote = me && me.role !== "guest";
  const isAdmin = me?.role === "admin";
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState("");
  const allPolls = [...(customPolls || []), ...polls];
  const board = useMemo(() => predictionBoard(players, matches, votes), [players, matches, votes]);
  const pct = (value, total) => (total ? Math.round((value / total) * 100) : 0);
  const createPoll = () => {
    const q = pollQuestion.trim();
    const opts = pollOptions.split(/\n|,/).map((item) => item.trim()).filter(Boolean).slice(0, 6);
    if (!q || opts.length < 2 || !canVote) return;
    onPollCreate({ id: `poll-${Date.now()}`, q, opts, by: me.name, createdAt: Date.now() });
    setPollQuestion("");
    setPollOptions("");
  };

  return (
    <div className="rise">
      <div className="section-head"><div className="section-title"><Vote />Match predictions</div></div>
      <section className="panel pad" style={{ marginBottom: 18 }}>
        <div className="section-title" style={{ marginBottom: 12 }}><Target />Prediction ranking</div>
        <div className="player-grid">
          {board.slice(0, 6).map((player, index) => <div className="metric" key={player.id}><div className="player-cell"><span className={`rank ${index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "bronze" : ""}`}>{index + 1}</span><Avatar name={player.name} size={34} img={player.avatar} /><div><div className="player-name">{player.name}</div><div className="metric-note">{player.predictionHits}/{player.predictionTotal || 0} correct predictions</div></div></div></div>)}
        </div>
      </section>
      <div className="vote-grid">
        {upcoming.map((match) => {
          const ownerA = getOwner(match.a, players);
          const ownerB = getOwner(match.b, players);
          const current = voteCounts(votes[match.id]);
          const total = (current.A || 0) + (current.Draw || 0) + (current.B || 0);
          const mine = votes[match.id]?.byUser?.[me?.name] || myVotes[match.id];
          const locked = match.status !== "upcoming";
          const result = correctChoice(match);
          return (
            <section className="vote-card" key={match.id}>
              <div className="vote-head"><div className="vote-title"><Flag country={match.a} size={18} round />{match.a}<span style={{ color: "var(--faint)" }}>v</span>{match.b}<Flag country={match.b} size={18} round /></div><div className="vote-date">{locked ? "Closed" : fmtDate(match.date)}</div></div>
              <div className="vote-body">
                {canVote && !locked && <div className="vote-options">{[["A", match.a], ["Draw", "Draw"], ["B", match.b]].map(([choice, label]) => <button type="button" key={choice} className={`vote-option ${mine === choice ? "active" : ""}`} onClick={() => onVote(match.id, choice)} title={label}>{label}</button>)}</div>}
                {[["A", match.a, "var(--green)"], ["Draw", "Draw", "var(--amber)"], ["B", match.b, "var(--blue)"]].map(([choice, label, color]) => <div className="vote-row" key={choice}><span className="vote-row-label">{label}</span><div className="vote-track"><div className="vote-fill" style={{ width: `${pct(current[choice] || 0, total)}%`, background: color }} /></div><span className="vote-pct">{pct(current[choice] || 0, total)}%</span></div>)}
                {ownerA && ownerB && ownerA.id !== ownerB.id && <div className="vote-meta"><Swords />{ownerA.name} vs {ownerB.name} - {total} {total === 1 ? "vote" : "votes"}{result ? ` - result ${result}` : ""}</div>}
                {isAdmin && !locked && <div className="onbehalf"><span className="onbehalf-label"><Shield />Add on behalf</span><div className="onbehalf-btns">{[["A", match.a], ["Draw", "Draw"], ["B", match.b]].map(([choice, label]) => <button type="button" key={choice} className="ob-btn" onClick={() => onVoteFor(match.id, choice)} title={`Add a vote for ${label}`}><Plus />{label}</button>)}</div></div>}
                {!canVote && <div className="vote-meta"><LogIn />Guests can view predictions; players can vote before kickoff.</div>}
                {locked && <div className="vote-meta"><Check />Voting closed when this match started.</div>}
              </div>
            </section>
          );
        })}
        {!upcoming.length && <div className="empty"><CalendarDays />No upcoming matches available for voting.</div>}
      </div>
      <div className="section-head"><div className="section-title"><Crown />Player polls</div></div>
      {canVote && <section className="panel pad" style={{ marginBottom: 18 }}>
        <div className="field"><label>Poll question</label><input className="input" value={pollQuestion} onChange={(event) => setPollQuestion(event.target.value)} placeholder="Ask the office..." /></div>
        <div className="field"><label>Options</label><textarea className="textarea" value={pollOptions} onChange={(event) => setPollOptions(event.target.value)} placeholder="One option per line, or comma separated" /></div>
        <button type="button" className="btn btn-primary" disabled={!pollQuestion.trim()} onClick={createPoll}><Plus />Create poll</button>
      </section>}
      {allPolls.map((poll) => {
        const current = pollVotes[poll.id] || {};
        const total = Object.values(current).reduce((sum, value) => sum + value, 0);
        const mine = myPoll[poll.id];
        return (
          <section className="poll-card" key={poll.id}>
            <div className="poll-question"><Crown />{poll.q}</div>
            {poll.by && <div className="vote-meta" style={{ padding: "0 18px 10px" }}>Created by {poll.by}</div>}
            {poll.opts.map((option) => {
              const value = current[option] || 0;
              const percentage = pct(value, total);
              const active = mine === option;
              return <button type="button" className={`poll-option ${active ? "active" : ""}`} key={option} onClick={() => canVote && onPoll(poll.id, option)}><div className="poll-bar"><div className="poll-fill" style={{ width: `${percentage}%` }} /><div className="poll-text"><span>{option}</span>{active && <span className="check-bubble"><Check /></span>}{total > 0 && <span className="poll-pct">{percentage}%</span>}</div></div></button>;
            })}
            {isAdmin && <div className="onbehalf"><span className="onbehalf-label"><Shield />Add on behalf</span><div className="onbehalf-btns">{poll.opts.map((option) => <button type="button" key={option} className="ob-btn" onClick={() => onPollFor(poll.id, option)} title={`Add a vote for ${option}`}><Plus />{option}</button>)}</div></div>}
            {!canVote && <div className="vote-meta"><LogIn />Guests can view polls; players can vote and create new polls.</div>}
          </section>
        );
      })}
    </div>
  );
}

function Admin({ players, matches, announcements, onMatch, onPlayer, onAvatar, onAnnAdd, onAnnDel, live, autoMode, setAutoMode, storeOn }) {
  const [tab, setTab] = useState("matches");
  const [announcement, setAnnouncement] = useState("");

  const uploadAvatar = async (event, id) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const dataUrl = await readAvatarFile(file);
    onAvatar(id, dataUrl);
    event.target.value = "";
  };
  const [scores, setScores] = useState(() => Object.fromEntries(matches.map((match) => [match.id, { sa: match.sa ?? 0, sb: match.sb ?? 0 }])));

  useEffect(() => {
    setScores(Object.fromEntries(matches.map((match) => [match.id, { sa: match.sa ?? 0, sb: match.sb ?? 0 }])));
  }, [matches]);

  const bannerClass = !autoMode ? "" : live.status === "live" ? "ok" : live.status === "error" ? "warn" : "";
  const bannerTitle = !autoMode ? "Manual control enabled" : live.status === "live" ? "Live feed connected" : live.status === "error" ? "Live feed offline - manual fallback ready" : "Connecting to live feed";
  const tabs = [["matches", CircleDot, "Matches"], ["players", Users, "Players"], ["news", Megaphone, "News"]];

  return (
    <div className="rise">
      <section className={`admin-banner ${bannerClass}`}>
        <div className="admin-left">
          {autoMode && live.status === "live" ? <Wifi color="var(--green-dark)" /> : <WifiOff color="var(--muted)" />}
          <div><div className="admin-title">{bannerTitle}</div><div className="admin-copy">{storeOn ? "Changes are saved to shared storage when available, otherwise localStorage is used. " : "Browser storage is unavailable, so changes are session-only. "}Auto mode updates scores from the feed; manual controls remain available for corrections.</div></div>
        </div>
        <div style={{ display: "flex", gap: 8 }}><button type="button" className="btn btn-soft btn-small" onClick={live.sync}><RefreshCw />Sync now</button><button type="button" className={`btn btn-small ${autoMode ? "btn-primary" : "btn-soft"}`} onClick={() => setAutoMode((value) => !value)}>{autoMode ? "Auto on" : "Auto off"}</button></div>
      </section>
      <div className="tabs">{tabs.map(([id, Icon, label]) => <button type="button" key={id} className={`tab-btn ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}><Icon />{label}</button>)}</div>

      {tab === "matches" && (
        <section className="panel table-wrap">
          <table className="admin-table">
            <thead><tr><th>Match</th><th>Date</th><th>Status</th><th>Score</th><th className="right">Action</th></tr></thead>
            <tbody>{matches.map((match) => (
              <tr key={match.id}>
                <td><div className="flag-row" style={{ fontWeight: 900 }}><Flag country={match.a} size={16} round />{match.a}<span style={{ color: "var(--faint)", fontWeight: 700 }}>v</span>{match.b}<Flag country={match.b} size={16} round /></div></td>
                <td style={{ color: "var(--muted)", fontWeight: 750 }}>{fmtDate(match.date)}</td>
                <td><select className="select" value={match.status} onChange={(event) => onMatch(match.id, { status: event.target.value })}><option value="upcoming">Upcoming</option><option value="live">Live</option><option value="completed">Completed</option></select></td>
                <td><div className="flag-row"><input className="score-input" type="number" min="0" value={scores[match.id]?.sa ?? 0} onChange={(event) => setScores((prev) => ({ ...prev, [match.id]: { ...prev[match.id], sa: Number(event.target.value) || 0 } }))} /><span className="num" style={{ color: "var(--faint)", fontWeight: 900 }}>:</span><input className="score-input" type="number" min="0" value={scores[match.id]?.sb ?? 0} onChange={(event) => setScores((prev) => ({ ...prev, [match.id]: { ...prev[match.id], sb: Number(event.target.value) || 0 } }))} /></div></td>
                <td className="right"><button type="button" className="btn btn-primary btn-small" onClick={() => onMatch(match.id, { sa: scores[match.id]?.sa ?? 0, sb: scores[match.id]?.sb ?? 0 })}><Check />Save</button></td>
              </tr>
            ))}</tbody>
          </table>
        </section>
      )}

      {tab === "players" && (
        <section className="panel table-wrap">
          <table className="admin-table">
            <thead><tr><th>Player</th><th>Photo</th><th>Record</th><th>Bonus</th><th>Elimination controls</th></tr></thead>
            <tbody>{players.map((player) => (
              <tr key={player.id}>
                <td><div className="player-cell"><Avatar name={player.name} size={34} img={player.avatar} /><strong>{player.name}</strong><span className="tag done">{player.pts} pts</span></div></td>
                <td><button type="button" className="btn btn-soft btn-small" onClick={() => document.getElementById(`adm-av-${player.id}`)?.click()}><Upload />{player.avatar ? "Replace" : "Upload"}</button><input id={`adm-av-${player.id}`} type="file" accept="image/*" onChange={(event) => uploadAvatar(event, player.id)} style={{ display: "none" }} aria-label={`Upload photo for ${player.name}`} /></td>
                <td style={{ color: "var(--muted)", fontWeight: 800 }}>{player.w}W - {player.d}D - {player.l}L</td>
                <td><input className="score-input" style={{ width: 64 }} type="number" value={player._bonus || 0} onChange={(event) => onPlayer(player.id, { _bonus: Number(event.target.value) || 0 })} /></td>
                <td>{player.countries.map((country) => {
                  const eliminated = player.elim.includes(country);
                  return <button type="button" key={country} className={`eliminate-chip ${eliminated ? "out" : ""}`} onClick={() => onPlayer(player.id, { elim: eliminated ? player.elim.filter((item) => item !== country) : [...player.elim, country] })}><Flag country={country} size={15} round />{country}{eliminated ? " x" : ""}</button>;
                })}</td>
              </tr>
            ))}</tbody>
          </table>
        </section>
      )}

      {tab === "news" && (
        <div>
          <section className="panel pad" style={{ marginBottom: 18 }}>
            <div className="field"><label>Post announcement</label><textarea className="textarea" value={announcement} onChange={(event) => setAnnouncement(event.target.value)} placeholder="Share a fixture update, leaderboard callout or office note..." /></div>
            <button type="button" className="btn btn-primary" disabled={!announcement.trim()} onClick={() => { onAnnAdd(announcement.trim()); setAnnouncement(""); }}><Plus />Post update</button>
          </section>
          <section className="panel">
            {announcements.length ? announcements.map((item) => <div className="announcement" key={item.id}><div className="announcement-icon"><Radio /></div><div style={{ flex: 1 }}><div className="announcement-text">{item.text}</div><div className="announcement-date">{item.date}</div></div><button type="button" className="btn btn-danger btn-small" onClick={() => onAnnDel(item.id)} aria-label="Delete announcement"><Trash2 /></button></div>) : <div className="empty"><Megaphone />No announcements yet.</div>}
          </section>
        </div>
      )}
    </div>
  );
}

function ProfileSettings({ me, players, onAvatar, onClose }) {
  const player = players.find((item) => item.name === me?.name);
  const uploadAvatar = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !player) return;
    const dataUrl = await readAvatarFile(file);
    onAvatar(player.id, dataUrl);
    event.target.value = "";
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-title"><Users />Profile</div>
        <div className="profile-head" style={{ marginBottom: 18 }}>
          <Avatar name={me.name} size={76} img={player?.avatar} />
          <div><div className="profile-name">{me.name}</div><div className="modal-sub" style={{ margin: "4px 0 0" }}>{me.role === "player" ? "Official player" : me.role}</div></div>
        </div>
        {me.role === "player" && player ? (
          <>
            <div className="field"><label>Profile photo</label><button type="button" className="btn btn-soft" onClick={() => document.getElementById("profile-avatar-upload")?.click()}><Upload />Upload or change photo</button><input id="profile-avatar-upload" type="file" accept="image/*" onChange={uploadAvatar} style={{ display: "none" }} /></div>
            <div className="field"><label>Your countries</label><div className="country-chips" style={{ padding: 0, borderTop: 0 }}>{player.countries.map((country) => <span key={country} className="country-chip"><Flag country={country} size={16} round />{country}</span>)}</div></div>
          </>
        ) : (
          <div className="modal-sub">Guests can comment in Fan Zone. Voting and profile photos are for official players.</div>
        )}
        <button type="button" className="btn btn-primary" style={{ width: "100%" }} onClick={onClose}>Done</button>
      </div>
    </div>
  );
}

function SignIn({ onClose, onLogin }) {
  const [mode, setMode] = useState("player");
  const [name, setName] = useState(APPROVED[0]);
  const [guestName, setGuestName] = useState("");
  const [password, setPassword] = useState("");
  const [admin, setAdmin] = useState(false);
  const [error, setError] = useState("");

  const submit = () => {
    setError("");
    if (admin) {
      if (password !== ADMIN_PIN) {
        setError("Admin PIN is incorrect.");
        return;
      }
      onLogin({ name: "Organizer", role: "admin" });
      return;
    }
    if (mode === "player") {
      if (!APPROVED.includes(name)) {
        setError("Choose one of the official players.");
        return;
      }
      onLogin({ name, role: "player" });
      return;
    }
    const cleanGuest = guestName.trim().slice(0, 32);
    if (!cleanGuest) {
      setError("Enter a guest display name.");
      return;
    }
    onLogin({ name: cleanGuest, role: "guest" });
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-title"><LogIn />Sign in</div>
        <div className="modal-sub">Players pick their official name to vote and manage their profile photo. Guests can read and comment, but cannot vote.</div>
        {!admin && <div className="chips" style={{ marginBottom: 14 }}>
          <button type="button" className={`filter-chip ${mode === "player" ? "active" : ""}`} onClick={() => setMode("player")}>Player</button>
          <button type="button" className={`filter-chip ${mode === "guest" ? "active" : ""}`} onClick={() => setMode("guest")}>Guest</button>
        </div>}
        {!admin && mode === "player" && <div className="field"><label>Official player</label><select className="select" autoFocus value={name} onChange={(event) => setName(event.target.value)} onKeyDown={(event) => event.key === "Enter" && submit()}>{APPROVED.map((player) => <option key={player} value={player}>{player}</option>)}</select></div>}
        {!admin && mode === "guest" && <div className="field"><label>Guest name</label><input className="input" autoFocus placeholder="e.g. Karma" value={guestName} onChange={(event) => setGuestName(event.target.value)} onKeyDown={(event) => event.key === "Enter" && submit()} /></div>}
        <label className="checkbox"><input type="checkbox" checked={admin} onChange={(event) => setAdmin(event.target.checked)} />I am an organizer</label>
        {admin && <div className="field"><label>Admin PIN</label><input className="input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} onKeyDown={(event) => event.key === "Enter" && submit()} /></div>}
        {error && <div style={{ color: "var(--red)", fontSize: 13, fontWeight: 850, marginBottom: 14 }}>{error}</div>}
        <div style={{ display: "flex", gap: 10 }}><button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={submit}><LogIn />{admin ? "Enter admin" : mode === "player" ? "Continue as player" : "Enter as guest"}</button><button type="button" className="btn btn-soft" onClick={onClose}><X /></button></div>
      </div>
    </div>
  );
}

const SCENE_MS = 10000;

function LiveClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return <span className="live-clock">{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>;
}

function LiveFlag({ country, big = false }) {
  const url = flagUrl(country, big);
  if (!url) return null;
  return <img className={big ? "lv-flag" : undefined} src={url} alt="" onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} />;
}

function LiveAva({ player, variant }) {
  if (!player) return null;
  return (
    <span className={`lv-ava ${variant}`} style={{ background: COLORS[player.name] || "#5b6b7d" }}>
      {player.avatar ? <img src={player.avatar} alt={`${player.name} photo`} /> : (player.name?.[0] || "?")}
    </span>
  );
}

// Full-screen, auto-rotating broadcast view for an office wall display.
function LiveDisplay({ matches, players, announcements, live, onExit }) {
  const liveMatches = matches.filter((m) => m.status === "live");
  const upcoming = matches.filter((m) => m.status === "upcoming");
  const completed = matches.filter((m) => m.status === "completed");
  const board = [...liveMatches, ...upcoming, ...completed].slice(0, 5);
  const standings = useMemo(() => [...players].sort(comparePlayers).slice(0, 8), [players]);
  const updates = announcements.slice(0, 3);

  const scenes = useMemo(() => {
    const list = [
      { id: "matches", label: liveMatches.length ? "Live & upcoming" : "Upcoming fixtures", Icon: Swords },
      { id: "standings", label: "Leaderboard", Icon: Trophy },
    ];
    if (updates.length) list.push({ id: "updates", label: "Latest updates", Icon: Megaphone });
    return list;
  }, [liveMatches.length, updates.length]);

  const [index, setIndex] = useState(0);
  const active = Math.min(index, scenes.length - 1);
  const scene = scenes[active];

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % scenes.length), SCENE_MS);
    return () => window.clearInterval(timer);
  }, [scenes.length]);

  useEffect(() => {
    const onKey = (event) => { if (event.key === "Escape") onExit(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onExit]);

  return (
    <div className="live-screen">
      <div className="live-top">
        <div className="live-brand">
          <div className="live-mark"><Trophy weight="fill" aria-hidden="true" /></div>
          <div className="live-bt">DHI World Cup<small>Office Pool - 2026</small></div>
        </div>
        <span className={`live-pill ${liveMatches.length ? "" : "idle"}`}><span className="status-dot" />{liveMatches.length ? `${liveMatches.length} live now` : "Live board"}</span>
        <LiveClock />
        <button type="button" className="live-exit" onClick={onExit} aria-label="Exit live display"><X aria-hidden="true" /></button>
      </div>

      <div className="live-stage">
        <div className="live-kicker"><scene.Icon aria-hidden="true" />{scene.label}<span className="line" /></div>
        <div className="scene-in" key={scene.id}>
          {scene.id === "matches" && (
            <div className="lv-matches">
              {board.map((m) => {
                const ownerA = getOwner(m.a, players);
                const ownerB = getOwner(m.b, players);
                const hasScore = m.status !== "upcoming";
                return (
                  <div className={`lv-match ${m.status === "live" ? "is-live" : ""}`} key={m.id}>
                    <div className="lv-team">
                      <LiveFlag country={m.a} big />
                      <div style={{ minWidth: 0 }}><div className="lv-tname">{m.a}</div>{ownerA && <div className="lv-owner"><LiveAva player={ownerA} variant="own" />{ownerA.name}</div>}</div>
                    </div>
                    <div className="lv-mid">
                      <span className={`lv-tag ${m.status === "live" ? "live" : m.status === "completed" ? "ft" : "soon"}`}>{m.status === "live" ? "Live" : m.status === "completed" ? "Full time" : m.time}</span>
                      {hasScore ? <div className="lv-score">{m.sa ?? 0}<span className="dash">-</span>{m.sb ?? 0}</div> : <div className="lv-vs">VS</div>}
                    </div>
                    <div className="lv-team right">
                      <LiveFlag country={m.b} big />
                      <div style={{ minWidth: 0 }}><div className="lv-tname">{m.b}</div>{ownerB && <div className="lv-owner"><LiveAva player={ownerB} variant="own" />{ownerB.name}</div>}</div>
                    </div>
                  </div>
                );
              })}
              {!board.length && <div className="lv-update"><div className="ic"><CalendarDays aria-hidden="true" /></div><div className="lv-utext">No fixtures to show yet.</div></div>}
            </div>
          )}
          {scene.id === "standings" && (
            <div className="lv-board">
              {standings.map((player, i) => (
                <div className={`lv-row ${i === 0 ? "lead" : ""}`} key={player.id}>
                  <span className="lv-rank">{i + 1}</span>
                  <LiveAva player={player} variant="row" />
                  <span className="lv-pname">{player.name}</span>
                  <span className="lv-flags">{getActiveCountries(player).slice(0, 3).map((country) => <LiveFlag key={country} country={country} />)}</span>
                  <span className="lv-pts">{player.pts}<small>pts</small></span>
                </div>
              ))}
            </div>
          )}
          {scene.id === "updates" && (
            <div className="lv-updates" aria-live="polite">
              {updates.map((item) => (
                <div className="lv-update" key={item.id}><div className="ic"><Radio weight="fill" aria-hidden="true" /></div><div><div className="lv-utext">{item.text}</div><div className="lv-udate">{item.date}</div></div></div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="live-foot">
        <div className="live-dots">{scenes.map((s, i) => <span key={s.id} className={`live-dot ${i === active ? "on" : ""}`} style={{ "--scene-ms": `${SCENE_MS}ms` }} />)}</div>
        <span className="live-foot-label">{scene.label}</span>
        <div className="live-meta"><span>Feed <b>{live.status === "live" ? "live" : "manual"}</b></span><span><b>{completed.length}</b>/{matches.length} played</span><span><b>{players.length}</b> players</span></div>
      </div>
    </div>
  );
}

export default function App() {
  useDocumentFont();
  const [tab, setTab] = useState(() => loadSavedTab());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [players, setPlayers] = useState(SEED_PLAYERS);
  const [matches, setMatches] = useState(SEED_MATCHES);
  const [announcements, setAnnouncements] = useState(SEED_ANN);
  const [votes, setVotes] = useState({});
  const [pollVotes, setPollVotes] = useState({});
  const [customPolls, setCustomPolls] = useState([]);
  const [fanComments, setFanComments] = useState([]);
  const [myVotes, setMyVotes] = useState({});
  const [myPoll, setMyPoll] = useState({});
  const [me, setMe] = useState(() => loadLocalUser());
  const [showSignIn, setShowSignIn] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [liveScreen, setLiveScreen] = useState(false);
  const [autoMode, setAutoMode] = useState(true);
  const [liveStatus, setLiveStatus] = useState("idle");
  const [lastSync, setLastSync] = useState(null);
  const [storeOn, setStoreOn] = useState(false);
  const writingRef = useRef(false);
  const matchesRef = useRef(matches);
  const playersRef = useRef(players);
  const announcementsRef = useRef(announcements);
  const votesRef = useRef(votes);
  const pollVotesRef = useRef(pollVotes);
  const customPollsRef = useRef(customPolls);
  const fanCommentsRef = useRef(fanComments);
  const stateUpdatedAtRef = useRef(0);

  useEffect(() => { matchesRef.current = matches; }, [matches]);
  useEffect(() => { playersRef.current = players; }, [players]);
  useEffect(() => { announcementsRef.current = announcements; }, [announcements]);
  useEffect(() => { votesRef.current = votes; }, [votes]);
  useEffect(() => { pollVotesRef.current = pollVotes; }, [pollVotes]);
  useEffect(() => { customPollsRef.current = customPolls; }, [customPolls]);
  useEffect(() => { fanCommentsRef.current = fanComments; }, [fanComments]);
  useEffect(() => { setStoreOn(storageAvailable()); }, []);
  useEffect(() => {
    if (!me && !loadLocalUser()) setShowSignIn(true);
  }, [me]);

  const pushState = useCallback(async (partial = {}) => {
    if (!storageAvailable()) return;
    writingRef.current = true;
    const updatedAt = Date.now();
    stateUpdatedAtRef.current = updatedAt;
    await saveState({
      updatedAt,
      matches: partial.matches ?? matchesRef.current,
      players: partial.players ?? playersRef.current,
      announcements: partial.announcements ?? announcementsRef.current,
      votes: partial.votes ?? votesRef.current,
      pollVotes: partial.pollVotes ?? pollVotesRef.current,
      customPolls: partial.customPolls ?? customPollsRef.current,
      fanComments: partial.fanComments ?? fanCommentsRef.current,
    });
    window.setTimeout(() => { writingRef.current = false; }, 250);
  }, []);

  const applyRemote = useCallback((state) => {
    if (!state) return;
    const incomingAt = Number(state.updatedAt || 0);
    if (incomingAt && incomingAt < stateUpdatedAtRef.current) return;
    if (incomingAt) stateUpdatedAtRef.current = incomingAt;
    const cleanState = sanitizeData(state);
    // Only swap in a slice when it genuinely differs from what's on screen.
    // Otherwise every poll would hand React brand-new array/object references
    // (identical content) and force a full re-render, making the page twitch
    // and reset hover/selection while the reader is mid-scroll.
    const merge = (setter) => (incoming) => setter((prev) => (sameData(prev, incoming) ? prev : incoming));
    if (cleanState.matches) merge(setMatches)(cleanState.matches);
    if (cleanState.players) merge(setPlayers)(cleanState.players);
    if (cleanState.announcements) merge(setAnnouncements)(cleanState.announcements);
    if (cleanState.votes) merge(setVotes)(cleanState.votes);
    if (cleanState.pollVotes) merge(setPollVotes)(cleanState.pollVotes);
    if (cleanState.customPolls) merge(setCustomPolls)(cleanState.customPolls);
    if (!hostedFanApiReady() && !supabaseReady() && cleanState.fanComments) merge(setFanComments)(cleanState.fanComments);
  }, []);

  useEffect(() => {
    let alive = true;
    loadState().then((state) => { if (alive && state) applyRemote(state); });
    const interval = window.setInterval(async () => {
      if (writingRef.current) return;
      const state = await loadState();
      if (alive && state) applyRemote(state);
    }, 5000);
    return () => { alive = false; window.clearInterval(interval); };
  }, [applyRemote]);

  useEffect(() => {
    if (!hostedFanApiReady() && !supabaseReady()) return undefined;
    let alive = true;
    const syncFanComments = async () => {
      try {
        const remote = await loadFanComments();
        if (alive && remote) setFanComments((previous) => {
          const merged = mergeFanLists(previous, remote);
          return sameData(previous, merged) ? previous : merged;
        });
      } catch {
        // Keep the local optimistic feed if the hosted comment backend is unavailable.
      }
    };
    syncFanComments();
    const interval = window.setInterval(syncFanComments, 4000);
    return () => { alive = false; window.clearInterval(interval); };
  }, []);

  const fetchLive = useCallback(async () => {
    if (!API.enabled || !autoMode) {
      setLiveStatus("manual");
      return;
    }
    setLiveStatus((value) => (value === "live" ? "live" : "connecting"));
    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), API.timeoutMs);
      const response = await fetch(API.url, { headers: API.headers, signal: controller.signal });
      window.clearTimeout(timeout);
      if (!response.ok) throw new Error("feed failed");
      const parsed = parseResponse(await response.json());
      if (!parsed.length) throw new Error("empty feed");
      setMatches((previous) => {
        let changed = false;
        const next = previous.map((match) => {
          const hit = parsed.find((item) => (item.home === match.a && item.away === match.b) || (item.home === match.b && item.away === match.a));
          if (!hit) return match;
          const flipped = hit.home === match.b;
          const sa = flipped ? hit.awayScore : hit.homeScore;
          const sb = flipped ? hit.homeScore : hit.awayScore;
          if (match.sa === sa && match.sb === sb && match.status === hit.status) return match;
          changed = true;
          return { ...match, sa: sa ?? match.sa, sb: sb ?? match.sb, status: hit.status || match.status };
        });
        if (changed) pushState({ matches: next });
        return changed ? next : previous;
      });
      setLiveStatus("live");
      setLastSync(new Date());
    } catch {
      setLiveStatus("error");
    }
  }, [autoMode, pushState]);

  useEffect(() => {
    if (!API.enabled) {
      setLiveStatus("manual");
      return undefined;
    }
    fetchLive();
    const interval = window.setInterval(fetchLive, API.refreshMs);
    return () => window.clearInterval(interval);
  }, [fetchLive]);

  // A cold connection to the feed can be slow on the first hit; recover quickly
  // instead of waiting a full refresh cycle when a poll errors out.
  useEffect(() => {
    if (!API.enabled || !autoMode || liveStatus !== "error") return undefined;
    const retry = window.setTimeout(fetchLive, API.retryMs);
    return () => window.clearTimeout(retry);
  }, [liveStatus, autoMode, fetchLive]);

  // Standings (w/d/l/pts) are a pure function of the roster + match results, so
  // we derive them on render instead of storing them. Storing them created a
  // race: a storage poll could restore a roster whose points hadn't been
  // recomputed yet, snapping every total back to 0 until the next match change.
  const standings = useMemo(() => computePlayers(players, matches), [players, matches]);

  const live = useMemo(() => ({ status: liveStatus, lastSync, sync: fetchLive }), [fetchLive, lastSync, liveStatus]);

  const navigate = (id) => {
    setTab(id);
    saveCurrentTab(id);
    setSidebarOpen(false);
  };

  const onMatch = (id, updates) => setMatches((previous) => {
    const next = previous.map((match) => (match.id === id ? { ...match, ...updates } : match));
    pushState({ matches: next });
    return next;
  });

  const onPlayer = (id, updates) => setPlayers((previous) => {
    const next = previous.map((player) => (player.id === id ? { ...player, ...updates } : player));
    pushState({ players: next });
    return next;
  });

  const onAvatar = (id, dataUrl) => onPlayer(id, { avatar: dataUrl });

  const onAnnAdd = (text) => setAnnouncements((previous) => {
    const next = [{ id: Date.now(), text, date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }) }, ...previous];
    pushState({ announcements: next });
    return next;
  });

  const onAnnDel = (id) => setAnnouncements((previous) => {
    const next = previous.filter((item) => item.id !== id);
    pushState({ announcements: next });
    return next;
  });

  const onCommentAdd = async (comment) => {
    if (hostedFanApiReady() || supabaseReady()) {
      const optimistic = { ...comment, id: `temp-${comment.id}` };
      setFanComments((previous) => [optimistic, ...previous].slice(0, 500));
      try {
        const saved = await createFanComment(comment);
        if (saved) setFanComments((previous) => [saved, ...previous.filter((item) => item.id !== optimistic.id)].slice(0, 500));
      } catch {
        setFanComments((previous) => previous.map((item) => (item.id === optimistic.id ? { ...comment, localOnly: true } : item)));
      }
      return;
    }
    setFanComments((previous) => {
      const next = [comment, ...previous].slice(0, 500);
      pushState({ fanComments: next });
      return next;
    });
  };

  const onCommentDelete = (id) => {
    if (me?.role !== "admin") return;
    if (hostedFanApiReady() || supabaseReady()) hideFanComment(id);
    setFanComments((previous) => {
      const next = previous.map((item) => (item.id === id ? { ...item, hidden: true } : item));
      if (!hostedFanApiReady() && !supabaseReady()) pushState({ fanComments: next });
      return next;
    });
  };

  const onVote = (matchId, choice) => {
    if (!me || me.role === "guest") return;
    const previousChoice = votes[matchId]?.byUser?.[me.name] || myVotes[matchId];
    if (previousChoice === choice) return;
    setMyVotes((previous) => ({ ...previous, [matchId]: choice }));
    setVotes((previous) => {
      const current = previous[matchId] || {};
      const nextForMatch = { byUser: { ...(current.byUser || {}), [me.name]: choice } };
      const next = { ...previous, [matchId]: nextForMatch };
      pushState({ votes: next });
      return next;
    });
  };

  const onPollCreate = (poll) => setCustomPolls((previous) => {
    const next = [poll, ...previous].slice(0, 50);
    pushState({ customPolls: next });
    return next;
  });

  const onPoll = (pollId, option) => {
    if (!me || me.role === "guest") return;
    const previousOption = myPoll[pollId];
    if (previousOption === option) return;
    setMyPoll((previous) => ({ ...previous, [pollId]: option }));
    setPollVotes((previous) => {
      const current = previous[pollId] || {};
      const nextForPoll = { ...current, [option]: (current[option] || 0) + 1 };
      if (previousOption) nextForPoll[previousOption] = Math.max(0, (current[previousOption] || 0) - 1);
      const next = { ...previous, [pollId]: nextForPoll };
      pushState({ pollVotes: next });
      return next;
    });
  };

  // Organizer casts ballots on behalf of colleagues who never signed in.
  // delta lets them add (+1) or correct (-1) a tally directly.
  const onVoteFor = (matchId, choice, delta = 1) => {
    if (me?.role !== "admin") return;
    setVotes((previous) => {
      const current = previous[matchId] || {};
      const byUser = { ...(current.byUser || {}), [`Admin ${Date.now()}`]: choice };
      const next = { ...previous, [matchId]: { byUser } };
      pushState({ votes: next });
      return next;
    });
  };

  const onPollFor = (pollId, option, delta = 1) => {
    if (me?.role !== "admin") return;
    setPollVotes((previous) => {
      const current = previous[pollId] || {};
      const next = { ...previous, [pollId]: { ...current, [option]: Math.max(0, (current[option] || 0) + delta) } };
      pushState({ pollVotes: next });
      return next;
    });
  };

  const adminLocked = tab === "admin" && me?.role !== "admin";
  const activeNav = NAV.find(([id]) => id === tab) || NAV[0];
  const upcomingCount = matches.filter((match) => match.status === "upcoming").length;
  const onLogin = (user) => {
    setMe(user);
    saveLocalUser(user);
    setShowSignIn(false);
  };
  const onSignOut = () => {
    setMe(null);
    saveLocalUser(null);
    setShowSignIn(true);
  };

  return (
    <IconContext.Provider value={{ weight: "bold", mirrored: false }}>
      <style>{CSS}</style>
      <div className="app-shell">
        {sidebarOpen && <button type="button" aria-label="Close sidebar" onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(7,16,29,.42)", zIndex: 45 }} />}
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="brand"><div className="brand-mark"><Trophy /></div><div><div className="brand-title">DHI World Cup</div><div className="brand-sub">Office Pool 2026</div></div></div>
          <nav className="nav">
            <div className="nav-kicker">Workspace</div>
            {NAV.map(([id, label, Icon]) => (
              <button type="button" key={id} className={`navitem ${tab === id ? "active" : ""}`} onClick={() => navigate(id)}>
                <Icon /><span>{label}</span>{id === "voting" && upcomingCount > 0 && <span className="nav-badge">{upcomingCount}</span>}
              </button>
            ))}
          </nav>
          <div className="side-footer">
            {me ? <div className="account-card"><button type="button" onClick={() => setShowProfile(true)} style={{ background: "transparent", padding: 0, cursor: "pointer" }} title="Profile settings"><Avatar name={me.name} size={38} img={players.find((player) => player.name === me.name)?.avatar} /></button><button type="button" className="account-meta" style={{ background: "transparent", color: "inherit", textAlign: "left", cursor: "pointer" }} onClick={() => setShowProfile(true)}><div className="account-name">{me.name}</div><div className="account-role">{me.role}</div></button><button type="button" className="icon-btn" onClick={onSignOut} title="Sign out"><LogOut /></button></div> : <button type="button" className="signin-btn" onClick={() => setShowSignIn(true)}><LogIn />Sign in</button>}
          </div>
        </aside>

        <main className="main">
          <header className="topbar">
            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
              <button type="button" className="icon-btn mobile-menu" style={{ background: "#fff", color: "var(--ink)", border: "1px solid var(--line)" }} onClick={() => setSidebarOpen(true)}><Menu /></button>
              <div><div className="top-title">{activeNav[1]}</div><div className="top-subtitle">{SUBTITLE[tab]}</div></div>
            </div>
            <div className="top-actions"><button type="button" className="btn btn-soft btn-small" onClick={() => setLiveScreen(true)} title="Open the full-screen live display"><MonitorPlay /><span className="signin-top">Live screen</span></button><SyncStatus live={live} autoMode={autoMode} />{me ? <button type="button" className="btn btn-soft btn-small" onClick={() => setShowProfile(true)}><Users />Profile</button> : <button type="button" className="btn btn-primary btn-small signin-top" onClick={() => setShowSignIn(true)}><LogIn />Sign in</button>}</div>
          </header>

          <div className="page">
            {adminLocked ? <div className="empty"><Settings2 /><div style={{ color: "var(--muted)", fontSize: 15 }}>Admin access required.</div><button type="button" className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setShowSignIn(true)}><LogIn />Sign in as organizer</button></div>
              : tab === "dashboard" ? <Dashboard players={standings} matches={matches} announcements={announcements} go={navigate} />
              : tab === "leaderboard" ? <Leaderboard players={standings} />
              : tab === "schedule" ? <Schedule matches={matches} players={standings} />
              : tab === "players" ? <PlayersView players={standings} me={me} onAvatar={onAvatar} />
              : tab === "voting" ? <Voting matches={matches} players={standings} votes={votes} myVotes={myVotes} me={me} onVote={onVote} polls={SEED_POLLS} customPolls={customPolls} pollVotes={pollVotes} myPoll={myPoll} onPoll={onPoll} onPollCreate={onPollCreate} onVoteFor={onVoteFor} onPollFor={onPollFor} />
              : tab === "fanzone" ? <FanZone matches={matches} players={standings} me={me} comments={fanComments} onCommentAdd={onCommentAdd} onCommentDelete={onCommentDelete} />
              : tab === "admin" ? <Admin players={standings} matches={matches} announcements={announcements} onMatch={onMatch} onPlayer={onPlayer} onAvatar={onAvatar} onAnnAdd={onAnnAdd} onAnnDel={onAnnDel} live={live} autoMode={autoMode} setAutoMode={setAutoMode} storeOn={storeOn} />
              : null}
          </div>
        </main>

        <nav className="mobile-nav">
          {NAV.slice(0, 6).map(([id, label, Icon]) => <button type="button" key={id} className={`mobile-nav-item ${tab === id ? "active" : ""}`} onClick={() => navigate(id)}><Icon /><span>{label}</span></button>)}
        </nav>
      </div>
      {showSignIn && <SignIn onClose={() => setShowSignIn(false)} onLogin={onLogin} />}
      {showProfile && me && <ProfileSettings me={me} players={players} onAvatar={onAvatar} onClose={() => setShowProfile(false)} />}
      {liveScreen && <LiveDisplay matches={matches} players={standings} announcements={announcements} live={live} onExit={() => setLiveScreen(false)} />}
    </IconContext.Provider>
  );
}


