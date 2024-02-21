
const weapon_image_size = 256;
const option_image_size = 64;
const weapon_image_columns = 10;
const sub_weapons = 14;
const special_weapons = 19;
var current_weapon;
var streak = 0;
var selections_made = 0;
var settings = {
    weapon_name_hidden: false,
    sub_options_count: 6,
    special_options_count: 6,
    sub_options_random: true,
    special_options_random: true,
    all_weapons_before_repeat: true,
    cookies_accepted: false
};

const weapons = [
    {
        name: ".52 Gal",
        sub: 4,
        special: 8
    },
    {
        name: ".96 Gal",
        sub: 3,
        special: 7
    },
    {
        name: ".96 Gal Deco",
        sub: 4,
        special: 16
    },
    {
        name: "Aerospray MG",
        sub: 5,
        special: 12
    },
    {
        name: "Aerospray RG",
        sub: 3,
        special: 5
    },
    {
        name: "Annaki Splattershot Nova",
        sub: 10,
        special: 9
    },
    {
        name: "Ballpoint Splatling",
        sub: 5,
        special: 9
    },
    {
        name: "Ballpoint Splatling Nouveau",
        sub: 10,
        special: 7
    },
    {
        name: "Bamboozler 14 Mk I",
        sub: 7,
        special: 8
    },
    {
        name: "Big Swig Roller",
        sub: 4,
        special: 7
    },
    {
        name: "Big Swig Roller Express",
        sub: 12,
        special: 4
    },
    {
        name: "Blaster",
        sub: 7,
        special: 1
    },
    {
        name: "Bloblobber",
        sub: 3,
        special: 4
    },
    {
        name: "Bloblobber Deco",
        sub: 12,
        special: 16
    },
    {
        name: "Carbon Roller",
        sub: 7,
        special: 2
    },
    {
        name: "Carbon Roller Deco",
        sub: 2,
        special: 0
    },
    {
        name: "Clash Blaster",
        sub: 0,
        special: 0
    },
    {
        name: "Clash Blaster Neo",
        sub: 6,
        special: 15
    },
    {
        name: "Classic Squiffer",
        sub: 9,
        special: 1
    },
    {
        name: "Custom Blaster",
        sub: 9,
        special: 17
    },
    {
        name: "Custom Dualie Squelchers",
        sub: 8,
        special: 15
    },
    {
        name: "Custom Goo Tuber",
        sub: 5,
        special: 10
    },
    {
        name: "Custom Jet Squelcher",
        sub: 11,
        special: 4
    },
    {
        name: "Custom Splattershot Jr.",
        sub: 13,
        special: 6
    },
    {
        name: "Dapple Dualies",
        sub: 8,
        special: 14
    },
    {
        name: "Dapple Dualies Nouveau",
        sub: 13,
        special: 12
    },
    {
        name: "Dark Tetra Dualies",
        sub: 7,
        special: 12
    },
    {
        name: "Dread Wringer",
        sub: 1,
        special: 12
    },
    {
        name: "Dualie Squelchers",
        sub: 0,
        special: 6
    },
    {
        name: "Dynamo Roller",
        sub: 3,
        special: 14
    },
    {
        name: "E-liter 4K",
        sub: 10,
        special: 6
    },
    {
        name: "E-liter 4K Scope",
        sub: 10,
        special: 6
    },
    {
        name: "Enperry Splat Dualies",
        sub: 6,
        special: 17
    },
    {
        name: "Explosher",
        sub: 9,
        special: 4
    },
    {
        name: "Flingza Roller",
        sub: 10,
        special: 3
    },
    {
        name: "Foil Squeezer",
        sub: 7,
        special: 18
    },
    {
        name: "Forge Splattershot Pro",
        sub: 1,
        special: 5
    },
    {
        name: "Glooga Dualies",
        sub: 4,
        special: 5
    },
    {
        name: "Goo Tuber",
        sub: 13,
        special: 3
    },
    {
        name: "Gold Dynamo Roller",
        sub: 0,
        special: 15
    },
    {
        name: "H-3 Nozzlenose",
        sub: 9,
        special: 14
    },
    {
        name: "H-3 Nozzlenose D",
        sub: 4,
        special: 1
    },
    {
        name: "Heavy Edit Splatling",
        sub: 6,
        special: 14
    },
    {
        name: "Heavy Splatling",
        sub: 3,
        special: 6
    },
    {
        name: "Heavy Splatling Deco",
        sub: 9,
        special: 16
    },
    {
        name: "Hero Shot Replica",
        sub: 1,
        special: 0
    },
    {
        name: "Hydra Splatling",
        sub: 7,
        special: 5
    },
    {
        name: "Inkbrush",
        sub: 0,
        special: 8
    },
    {
        name: "Inkbrush Nouveau",
        sub: 10,
        special: 10
    },
    {
        name: "Inkline Tri-Stringer",
        sub: 3,
        special: 15
    },
    {
        name: "Jet Squelcher",
        sub: 12,
        special: 7
    },
    {
        name: "Krak-On Splat Roller",
        sub: 8,
        special: 16
    },
    {
        name: "L-3 Nozzlenose",
        sub: 6,
        special: 11
    },
    {
        name: "L-3 Nozzlenose D",
        sub: 2,
        special: 10
    },
    {
        name: "Light Tetra Dualies",
        sub: 3,
        special: 2
    },
    {
        name: "Luna Blaster",
        sub: 0,
        special: 2
    },
    {
        name: "Luna Blaster Neo",
        sub: 5,
        special: 10
    },
    {
        name: "Mini Splatling",
        sub: 2,
        special: 10
    },
    {
        name: "N-ZAP '85",
        sub: 1,
        special: 14
    },
    {
        name: "N-ZAP '89",
        sub: 7,
        special: 15
    },
    {
        name: "Nautilus 47",
        sub: 9,
        special: 4
    },
    {
        name: "Neo Splash-o-matic",
        sub: 1,
        special: 13
    },
    {
        name: "Splatana Stamper Nouveau",
        sub: 11,
        special: 11
    },
    {
        name: "Neo Sploosh-o-matic",
        sub: 8,
        special: 8
    },
    {
        name: "Octobrush",
        sub: 1,
        special: 2
    },
    {
        name: "Octobrush Nouveau",
        sub: 8,
        special: 4
    },
    {
        name: "Painbrush",
        sub: 6,
        special: 6
    },
    {
        name: "Painbrush Nouveau",
        sub: 9,
        special: 3
    },
    {
        name: "Range Blaster",
        sub: 1,
        special: 6
    },
    {
        name: "Rapid Blaster",
        sub: 10,
        special: 13
    },
    {
        name: "Rapid Blaster Deco",
        sub: 13,
        special: 9
    },
    {
        name: "Rapid Blaster Pro",
        sub: 11,
        special: 7
    },
    {
        name: "Rapid Blaster Pro Deco",
        sub: 12,
        special: 8
    },
    {
        name: "REEF-LUX 450",
        sub: 6,
        special: 3
    },
    {
        name: "REEF-LUX 450 Deco",
        sub: 4,
        special: 12
    },
    {
        name: "S-BLAST '91",
        sub: 2,
        special: 5
    },
    {
        name: "S-BLAST '92",
        sub: 3,
        special: 12
    },
    {
        name: "Slosher",
        sub: 0,
        special: 13
    },
    {
        name: "Slosher Deco",
        sub: 12,
        special: 2
    },
    {
        name: "Sloshing Machine",
        sub: 5,
        special: 5
    },
    {
        name: "Sloshing Machine Neo",
        sub: 9,
        special: 0
    },
    {
        name: "Snipewriter 5B",
        sub: 4,
        special: 4
    },
    {
        name: "Snipewriter 5H",
        sub: 3,
        special: 14
    },
    {
        name: "Sorella Brella",
        sub: 7,
        special: 9
    },
    {
        name: "Splash-o-matic",
        sub: 2,
        special: 11
    },
    {
        name: "Splat Brella",
        sub: 3,
        special: 13
    },
    {
        name: "Splat Charger",
        sub: 0,
        special: 7
    },
    {
        name: "Splat Dualies",
        sub: 1,
        special: 11
    },
    {
        name: "Splat Roller",
        sub: 6,
        special: 1
    },
    {
        name: "Splatana Stamper",
        sub: 2,
        special: 2
    },
    {
        name: "Splatana Wiper",
        sub: 13,
        special: 10
    },
    {
        name: "Splatana Wiper Deco",
        sub: 8,
        special: 3
    },
    {
        name: "Splatterscope",
        sub: 0,
        special: 7
    },
    {
        name: "Splattershot",
        sub: 1,
        special: 0
    },
    {
        name: "Splattershot Jr.",
        sub: 0,
        special: 1
    },
    {
        name: "Splattershot Nova",
        sub: 9,
        special: 8
    },
    {
        name: "Splattershot Pro",
        sub: 12,
        special: 11
    },
    {
        name: "Sploosh-o-matic",
        sub: 6,
        special: 10
    },
    {
        name: "Squeezer",
        sub: 4,
        special: 0
    },
    {
        name: "Tenta Brella",
        sub: 8,
        special: 7
    },
    {
        name: "Tenta Sorella Brella",
        sub: 10,
        special: 0
    },
    {
        name: "Tentatek Splattershot",
        sub: 0,
        special: 13
    },
    {
        name: "Tri-Slosher",
        sub: 11,
        special: 9
    },
    {
        name: "Tri-Slosher Nouveau",
        sub: 5,
        special: 14
    },
    {
        name: "Tri-Stringer",
        sub: 11,
        special: 8
    },
    {
        name: "Undercover Brella",
        sub: 10,
        special: 12
    },
    {
        name: "Undercover Sorella Brella",
        sub: 13,
        special: 18
    },
    {
        name: "Z+F Splat Charger",
        sub: 4,
        special: 13
    },
    {
        name: "Z+F Splatterscope",
        sub: 4,
        special: 13
    },
    {
        name: "Zink Mini Splatling",
        sub: 11,
        special: 1
    }
];

var unshown_weapons = [...Array(weapons.length).keys()];

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomSample(size, count, answer) {
    if (count > size) {
        count = size;
    }

    // Make a pool of options, replacing the correct answer with the last option
    let pool = [...Array(size - 1).keys()];
    if (answer < pool.length) {
        pool[answer] = pool.length;
    }

    // Get random options from the pool, removing them from the pool
    let result = [];
    for (let n = 0; n < count - 1; n++) {
        index = Math.floor(Math.random() * (pool.length - n));
        result.push(pool[index]);
        pool[index] = pool[pool.length - n - 1];
    }

    // Insert the correct answer at a random index
    result.splice(randomInt(0, result.length), 0, answer);

    return result;
}

function populate_sub_options() {
    let sub_options = randomSample(sub_weapons, settings.sub_options_count, current_weapon.sub);
    if (!settings.sub_options_random) {
        sub_options.sort(function(a, b) {return a - b});
        console.log(sub_options);
    }

    let text = "";
    for (let index = 0; index < sub_options.length; index++) {
        text += `<span id="sub-option-${sub_options[index]}" class="quiz-option quiz-option-open sub-option" onclick="optionSelected(event)" style="background-position: -${sub_options[index] * option_image_size}px"></span>`
    }
    document.getElementById("sub-options").innerHTML = text;
}

function populate_special_options() {
    let special_options = randomSample(special_weapons, settings.special_options_count, current_weapon.special);
    if (!settings.special_options_random) {
        special_options.sort(function(a, b) {return a - b});
    }

    let text = "";
    for (let index = 0; index < special_options.length; index++) {
        text += `<span id="special-option-${special_options[index]}" class="quiz-option quiz-option-open special-option" onclick="optionSelected(event)" style="background-position: -${special_options[index] * option_image_size}px"></span>`
    }
    document.getElementById("special-options").innerHTML = text;
}

function nextWeapon() {
    hideSettings();

    if (unshown_weapons.length == 0) {
        unshown_weapons = [...Array(weapons.length).keys()];
    }
    
    if (settings.all_weapons_before_repeat) {
        var weapon_index = unshown_weapons.splice(randomInt(0, unshown_weapons.length - 1), 1)[0];
    }
    else {
        var weapon_index = randomInt(0, weapons.length - 1);
    }

    let row = Math.floor(weapon_index / weapon_image_columns);
    let col = weapon_index % weapon_image_columns;
    document.getElementById("weapon-image").style.backgroundPosition = -col * weapon_image_size + "px " + -row * weapon_image_size + "px";
    
    current_weapon = weapons[weapon_index];
    document.getElementById("weapon-name").innerHTML = current_weapon.name;

    populate_sub_options();
    populate_special_options();
}

function optionSelected(e) {
    hideSettings();
    let selection = e.target.id;
    let type = selection.split("-", 1)
    if (type == "sub") {
        var correct_answer = `sub-option-${current_weapon.sub}`;
    }
    else {
        var correct_answer = `special-option-${current_weapon.special}`;
    }
    
    if (selection != correct_answer) {
        streak = -1;
        e.target.style["background-color"] = "#FF0000";
    }
    document.getElementById(correct_answer).style["background-color"] = "#00FF00";
    document.getElementById(`${type}-options`).childNodes.forEach(function(element) {
        element.classList.remove("quiz-option-open");
        element.classList.add("quiz-option-closed");
        element.removeAttribute("onclick");
    });
    selections_made++;
}

function updateStreak() {
    if (selections_made < 2) {
        streak = -1;
    }
    selections_made = 0;
    streak++;
    document.getElementById("streak-tracker").innerHTML = "Streak: " + streak;
}

function toggleSettingsVisibility() {
    var settings_elements = document.getElementsByClassName("settings")
    for (let i = 0; i < settings_elements.length; i++) {
        settings_elements[i].toggleAttribute("hidden");
    }
    let settings_button = document.getElementById("settings-button");
    settings_button.innerHTML = (settings_button.innerHTML == "Settings") ? "Hide Settings" : "Settings";

}

function hideSettings() {
    var settings_elements = document.getElementsByClassName("settings")
    for (let i = 0; i < settings_elements.length; i++) {
        settings_elements[i].setAttribute("hidden", true);
    }
    document.getElementById("settings-button").innerHTML = "Settings";
}

function loadSettings() {
    document.getElementById("sub-options-count").value = settings.sub_options_count;
    document.getElementById("special-options-count").value = settings.special_options_count;
    document.getElementById("sub-options-random").checked = settings.sub_options_random;
    document.getElementById("special-options-random").checked = settings.special_options_random;
}

function cookieToSettings() {
    let cookie_settings = decodeURIComponent(document.cookie).split(';');
    for (let i = 0; i < cookie_settings.length; i++) {
        if (cookie_settings[i].length > 0) {
            let setting = cookie_settings[i].split('=');
            let setting_name = setting[0].trim();
            let setting_value = setting[1].trim();

            if (setting_value === "true") setting_value = true;
            else if (setting_value === "false") setting_value = false;
            else setting_value = parseInt(setting_value);

            settings[setting_name] = setting_value;
        }
    }
}

function settingsToCookie() {
    for (let setting_name in settings) {
        document.cookie = setting_name + '=' + settings[setting_name] + ";max-age=31536000;path=/";
    }
}

function changeSetting(setting_name, setting_value) {
    settings[setting_name] = setting_value;
    if (settings.cookies_accepted) {
        document.cookie = setting_name + '=' + setting_value + ";max-age=31536000;path=/";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    cookieToSettings();
    loadSettings();
    nextWeapon();

    if (!settings.cookies_accepted) {
        document.getElementById("cookie-notification").removeAttribute("hidden");
    }

    document.getElementById("next-button").addEventListener("click", function(e) {
        updateStreak();
        nextWeapon();
    });

    document.addEventListener("keyup", function(e) {
        if (e.code == "Space") {
            updateStreak();
            nextWeapon();
        }
    });

    document.getElementById("settings-button").addEventListener("click", toggleSettingsVisibility);

    document.getElementById("weapon-name-setting").addEventListener("click", function(e) {
        changeSetting("weapon_name_hidden", !settings.weapon_name_hidden);
        document.getElementById("weapon-name").classList.toggle("striked");
        document.getElementById("weapon-name").classList.toggle("settings");
    });

    document.getElementById("sub-options-count").addEventListener("input", function(e) {
        changeSetting("sub_options_count", e.target.value);
        populate_sub_options();
    });

    document.getElementById("sub-options-random").addEventListener("change", function(e) {
        changeSetting("sub_options_random", e.target.checked);
        populate_sub_options();
    });

    document.getElementById("special-options-count").addEventListener("input", function(e) {
        changeSetting("special_options_count", e.target.value);
        populate_special_options();
    });

    document.getElementById("special-options-random").addEventListener("change", function(e) {
        changeSetting("special_options_random", e.target.checked);
        populate_special_options();
    });

    document.getElementById("cookie-accept").addEventListener("click", function(e) {
        changeSetting("cookies_accepted", true);
        settingsToCookie();
        document.getElementById("cookie-notification").setAttribute("hidden", "true");
    });
    document.getElementById("cookie-decline").addEventListener("click", function(e) {
        document.getElementById("cookie-notification").setAttribute("hidden", "true");
    });
});
