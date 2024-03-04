const weapon_image_size = 256;
const option_image_size = 64;

var settings = {
    cookie_version: "2",
    language: 'USen',
    weapon_info: 'pic-and-name',
    weapon_name_hidden: false,
    sub_options_count: 6,
    special_options_count: 6,
    options_random_order: false,
    all_weapons_before_repeat: true,
    show_option_names: false,
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
    return language_data[settings.language][category][entry];
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

function populateLanguageOptions() {
    let options = "";
    for (let index in languages) {
        let language = languages[index];
        if (language.ext == settings.language) {
            options += `<option value="${language.ext}" selected>${language.name}</option>`;
        }
        else {
        options += `<option value="${language.ext}">${language.name}</option>`;
        }
    }
    document.getElementById("language").innerHTML = options;
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
        var correct_answer = `${type}-option-${current_weapon.sub}`;
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
    document.getElementById("streak-number").innerHTML = streak;
}

function toggleSettingsVisibility() {
    overlay = document.getElementById("settings-overlay");
    if (overlay.style.display == "block") {
        overlay.style.display = "none";
    }
    else {
        overlay.style.display = "block";
    }
    // var settings_elements = document.getElementsByClassName("settings")
    // for (let i = 0; i < settings_elements.length; i++) {
    //     settings_elements[i].toggleAttribute("hidden");
    // }
    // let settings_button = document.getElementById("settings-button");
    // settings_button.innerHTML = (settings_button.innerHTML == "Settings") ? "Hide Settings" : "Settings";
}

function showSettings() {
    document.getElementById("settings-overlay").style.display = "block";
}

function hideSettings() {
    document.getElementById("settings-overlay").style.display = "none";
}

function loadSettings() {
    document.getElementById(settings.weapon_info).checked = "checked";
    document.getElementById("sub-options-count").value = settings.sub_options_count;
    document.getElementById("special-options-count").value = settings.special_options_count;
    document.getElementById("option-names").checked = settings.show_option_names;
    updateWeaponDisplay();
}

function cookieToSettings() {
    let cookie_settings = decodeURIComponent(document.cookie).split('; ');

    // Don't load cookies if version is outdated
    if (cookie_settings.length > 0) {
        let up_to_date = false;
        for (let i = 0; i < cookie_settings.length; i++) {
            let setting = cookie_settings[i].split('=');
            if (setting[0] == "cookie_version" && setting[1] == settings.cookie_version) {
                up_to_date = true;
            }
        }
        if (!up_to_date) {
            settings.cookies_accepted = true;
            return;
        }
    }

    // Load cookies
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

function updateText() {
    document.querySelectorAll("[data-text]").forEach(element => {
        element.textContent = language_data[settings.language]["UI"][element.getAttribute("data-text")];
    });
    document.getElementById("weapon-name").innerHTML = getTranslation('main', current_weapon.name);
}

function updateWeaponDisplay() {
    let image = document.getElementById("weapon-image");
    let name = document.getElementById("weapon-name");
    switch (settings.weapon_info) {
        case "pic-and-name":
            image.removeAttribute("hidden");
            name.removeAttribute("hidden");
            break;
        case "pic-only":
            image.removeAttribute("hidden");
            name.setAttribute("hidden", "hidden");
            break;
        case "name-only":
            image.setAttribute("hidden", "hidden");
            name.removeAttribute("hidden");
            break;
        default:
            break;
    }
    let quiz_container = document.getElementById("quiz-container");
    quiz_container.style.bottom = `min(30vh, 100vh - ${quiz_container.offsetHeight}px)`;
}

function addListeners() {
    document.getElementById("next-button").addEventListener("click", (event) => {
        updateStreak();
        nextWeapon();
    });

    document.addEventListener("keyup", (event) => {
        if (event.code == "Space") {
            updateStreak();
            nextWeapon();
        }
    });

    document.getElementById("settings-button").addEventListener("click", toggleSettingsVisibility);

    document.getElementById("language").addEventListener("change", (event) => {
        changeSetting("language", event.target.value);
        updateText();
    });

    document.getElementById("weapon-display").addEventListener("change", (event) => {
        changeSetting("weapon_info", event.target.id);
        updateWeaponDisplay();
    });

    document.getElementById("sub-options-count").addEventListener("input", (event) => {
        changeSetting("sub_options_count", event.target.value);
        populateSubOptions();
    });

    document.getElementById("special-options-count").addEventListener("input", (event) => {
        changeSetting("special_options_count", event.target.value);
        populateSpecialOptions();
    });

    document.getElementById("option-names").addEventListener("change", (event) => {
        changeSetting("show_option_names", event.target.checked);
    });

    document.getElementById("close-settings-button").addEventListener("click", (event) => {
        hideSettings();
    });

    document.getElementById("cookie-accept").addEventListener("click", (event) => {
        changeSetting("cookies_accepted", true);
        settingsToCookie();
        document.getElementById("cookie-notification").setAttribute("hidden", "true");
    });

    document.getElementById("cookie-decline").addEventListener("click", (event) => {
        document.getElementById("cookie-notification").setAttribute("hidden", "true");
    });

    const tooltip = document.getElementById('tooltip');
    window.onmousemove = (event) => {
        if (settings.show_option_names && event.target.classList.contains('quiz-option')) {
            let option_name = event.target.id.split('-').pop();
            tooltip.innerHTML = language_data[settings.language][event.target.classList.contains('sub-option') ? 'sub' : 'special'][option_name];
            let offset = tooltip.parentElement.getBoundingClientRect();
            tooltip.style.top = (event.clientY - offset.top + 15) + 'px';
            tooltip.style.left = (event.clientX - offset.left + 15) + 'px';
            tooltip.removeAttribute('hidden');
        }
        else {
            tooltip.setAttribute('hidden', 'hidden');
        }
    };
}

document.addEventListener("DOMContentLoaded", async function() {
    await loadJsonData();
    cookieToSettings();
    populateLanguageOptions();
    loadSettings();
    nextWeapon();
    updateText();

    if (!settings.cookies_accepted) {
        document.getElementById("cookie-notification").removeAttribute("hidden");
    }

    addListeners();
});
