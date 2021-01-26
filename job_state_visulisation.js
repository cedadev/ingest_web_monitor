/**
 * Created by sjp23 on 26/01/2021.
 */



// icons for states
//state_icons = {"killed": "skull", "died": "bomb", "new": "asterisk", "do_not_run": "ban",
//    "warn": "exclamation-triangle", "ok-errors": "exclamation-triangle", "fail": "bell", "cleanup": "broom",
//    "re-running": "cog"};

function state_icon(state) {
    // icons for states
    const state_icons = {"killed": "skull", "died": "bomb", "new": "asterisk", "re-running": "cog",
                         "do_not_run": "ban", "warn": "exclamation-triangle",
                         "ok-errors": "exclamation-triangle", "fail": "bell", "cleanup": "broom"};
    if (state_icons.hasOwnProperty(state)) {
        return '<i class="fas fa-' + state_icons[state] + '"></i>'
    } else {
        return ''
    }
}

// colours for states
const state_bootstrap_colours = {"ok": "success", "ok-errors": "success", "fail": "danger", "killed": "dark", "new": "info",
           "warn": "warning", "running": "primary", "died": "dark", "cleanup": "info", "re-running": "info",
           "do_not_run": "secondary"};

const state_colours = {"running": "blue", "ok": "green", "warn": "orange", "fail": "red", "killed": "darkred",
                     "died": "indigo", "do_not_run": "lightblue", "ok-errors": "lightgreen", "new": "lightblue",
                     "cleanup": "lightblue", "re-running": "lightgreen"};


const state_names = ["running", "ok", "warn", "fail", "killed", "died", "do_not_run", "new", "ok-errors", "cleanup", "re-running"];


var blop = new Audio('sounds/blop.mp3');
var clang = new Audio('sounds/clang.mp3');
var snap = new Audio('sounds/snap.mp3');
// sounds for states
const state_sounds = {"ok": blop, "ok-errors": blop, "fail": clang, "killed": clang, "new": blop,
                      "warn": snap, "running": blop, "died": clang, "cleanup": blop, "re-running": blop,
                      "do_not_run": blop};
