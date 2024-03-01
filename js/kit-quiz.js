const weapon_image_size = 256;
const option_image_size = 64;

var settings = {
    language: 'English',
    language_ext: 'USen',
    weapon_name_hidden: false,
    sub_options_count: 6,
    special_options_count: 6,
    options_random_order: false,
    all_weapons_before_repeat: true,
    cookies_accepted: false
};

var current_weapon;
var streak = 0;
var selections_made = 0;
var weapon_pool = {};

var languages;
var language_data;
var weapons;
var mains;
var subs;
var specials;

async function fetchJson(filename) {
    try {
        response = await fetch(filename);
        json = await response.json();
        return json;
    }
    catch (error) {
        console.error("Error fetching json data:", error);
    }
}

async function loadJsonData() {
    languages = await fetchJson('data/languages.json');
    language_data = await fetchJson('data/language_data.json');
    weapons = await fetchJson('data/weapons.json');
    let subs_specials = await fetchJson('data/subs_specials.json');
    mains = Object.keys(weapons);
    subs = subs_specials.subs;
    specials = subs_specials.specials;
}

function getTranslation(category, entry) {
    return language_data[settings.language_ext][category][entry];
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomSample(array, sampleSize, answer) {
    let pool = array.map((element, index) => ({element, index}));
    answer = pool.find((e) => e.element == answer);
    pool = pool.filter((element) => element != answer)

    for (let i = pool.length - 1; i > 0; i--) {
        let j = randomInt(0, i);
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    let result = pool.slice(0, sampleSize - 1);
    result.splice(randomInt(0, result.length), 0, answer);

    if(!settings.options_random_order) {
        result.sort(function(a, b) {return a.index - b.index});
    }

    return result.map((e) => e.element);
}

function randomProperty(obj) {
    let keys = Object.keys(obj);
    return obj[keys[keys.length * Math.random() << 0]];
}

function populateSubOptions() {
    let sub_options = randomSample(subs, settings.sub_options_count, current_weapon.sub);
    console.log(sub_options);

    let text = "";
    for (let option in sub_options) {
        let index = subs.indexOf(sub_options[option]);
        text += `<span id="sub-option-${sub_options[option]}" class="quiz-option quiz-option-open sub-option" onclick="optionSelected(event)" style="background-position: -${index * option_image_size}px 0px")}"></span>`
    }
    document.getElementById("sub-options").innerHTML = text;
}

function populateSpecialOptions() {
    let special_options = randomSample(specials, settings.special_options_count, current_weapon.special);

    let text = "";
    for (let option in special_options) {
        let index = specials.indexOf(special_options[option]);
        text += `<span id="special-option-${special_options[option]}" class="quiz-option quiz-option-open special-option" onclick="optionSelected(event)" style="background-position: -${index * option_image_size}px 0px"></span>`
    }
    document.getElementById("special-options").innerHTML = text;
}

function nextWeapon() {
    hideSettings();

    if (!settings.all_weapons_before_repeat || Object.keys(weapon_pool).length == 0) {
        weapon_pool = Object.assign({}, weapons);
    }
    current_weapon = randomProperty(weapon_pool);
    if (settings.all_weapons_before_repeat) {
        delete weapon_pool[current_weapon.name];
    }

    document.getElementById("weapon-image").style.backgroundPositionX = `${-current_weapon.index * weapon_image_size}px`;
    document.getElementById("weapon-name").innerHTML = getTranslation('main', current_weapon.name);

    populateSubOptions();
    populateSpecialOptions();
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
    //document.getElementById("settings-overlay").style.display = "block";
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
    //document.getElementById("sub-options-random").checked = settings.sub_options_random;
    //document.getElementById("special-options-random").checked = settings.special_options_random;
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
            else if (!isNaN(setting_value)) setting_value = parseInt(setting_value);

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

document.addEventListener("DOMContentLoaded", async function() {
    await loadJsonData();
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
        populateSubOptions();
    });

    /*document.getElementById("sub-options-random").addEventListener("change", function(e) {
        changeSetting("sub_options_random", e.target.checked);
        populateSubOptions();
    });*/

    document.getElementById("special-options-count").addEventListener("input", function(e) {
        changeSetting("special_options_count", e.target.value);
        populateSpecialOptions();
    });

    /*document.getElementById("special-options-random").addEventListener("change", function(e) {
        changeSetting("special_options_random", e.target.checked);
        populateSpecialOptions();
    });*/

    document.getElementById("cookie-accept").addEventListener("click", function(e) {
        changeSetting("cookies_accepted", true);
        settingsToCookie();
        document.getElementById("cookie-notification").setAttribute("hidden", "true");
    });
    document.getElementById("cookie-decline").addEventListener("click", function(e) {
        document.getElementById("cookie-notification").setAttribute("hidden", "true");
    });
});
