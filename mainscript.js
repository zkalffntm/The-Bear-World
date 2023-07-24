// ==UserScript==
// @name        The Bear World
// @namespace   Violentmonkey Scripts
// @match       https://app.roll20.net/editor/character/15336305/*
// @version     0.4
// @author      MandarinKAMO
// @description 2023. 7. 25.
// ==/UserScript==

const style_element = document.querySelector('head').querySelector('style[type="text/css"][title="charsheet"]');
const charactersheet = document.querySelector('form.sheetform').children[0]; // Used to search hidden attr inputs
const script_section = document.querySelector('body').querySelector('script[type="text/javascript"]');
const pc_tabs = charactersheet.querySelector('div.pc-tabs');


// Change logo
charactersheet.querySelector('img[alt="Pathfinder second edition logo"]').setAttribute('src', 'https://user-images.githubusercontent.com/9512556/254364854-55fa289a-ae2c-42cc-a8ed-8a5c51c9e16b.png');


// Remove Details, Alchemy tabs
pc_tabs.removeChild(pc_tabs.children[2]);
pc_tabs.removeChild(pc_tabs.children[5]);
var temp_text = style_element.textContent;
temp_text = temp_text.replaceAll('grid-template-columns: 3em repeat(6, 1fr)', 'grid-template-columns: 3em repeat(5, 1fr)');
temp_text = temp_text.replaceAll('grid-template-columns: 3em repeat(7, 1fr)', 'grid-template-columns: 3em repeat(5, 1fr)');
style_element.textContent = temp_text;


// Hero Points → Luck Points
charactersheet.querySelector('span[data-i18n="hero_points"]').innerText = 'luck points'


// Class DC
charactersheet.querySelector('div.classdc.background-color').children[1].children[2].children[1].innerText = '8';
charactersheet.querySelector('span[name="attr_class_dc"]').setAttribute('name', 'attr_class_dc_fixed');
const classdc_input = charactersheet.querySelector('input[name="attr_class_dc"][type="hidden"]');
const classdc_fixed_input = classdc_input.cloneNode(false);
classdc_fixed_input.setAttribute('name', 'attr_class_dc_fixed');
classdc_input.parentElement.insertBefore(classdc_fixed_input, classdc_input);
const classdc_input_observer = new MutationObserver(function(mutationsList, observer) {
  const classdc_input = charactersheet.querySelector('input[name="attr_class_dc"][type="hidden"]');
  const classdc_fixed_input = charactersheet.querySelector('input[name="attr_class_dc_fixed"][type="hidden"]');
  const classdc_fixed = classdc_input.value - 2;
  classdc_fixed_input.value = classdc_fixed
  charactersheet.querySelector('span[name="attr_class_dc_fixed"]').innerText = classdc_fixed;
});
classdc_input_observer.observe(classdc_input, { attributes: true });


// Tool proficiencies
const prof_section = charactersheet.querySelector('div.weapon-proficiences.background-color');
prof_section.children[0].innerText = 'Tool proficiencies';
prof_section.children[1].children[0].innerText = 'simple weapon';
prof_section.children[1].children[2].innerText = 'martial weapon';
for(prof_grid of charactersheet.querySelectorAll('div.grid.repeating-weapon-proficiences-grid'))
    prof_grid.removeChild(prof_grid.children[0]);


// Armor class fix
const ac_section_div = charactersheet.querySelector('div.grid.armorclass-main');
ac_section_div.removeChild(ac_section_div.children[5]);
const dr_label = ac_section_div.children[2].cloneNode(true);
ac_section_div.insertBefore(dr_label, ac_section_div.children[7]);
dr_label.style = 'grid-column: 6;';
dr_label.children[0].children[0].innerText = 'dr';
dr_label.children[0].children[1].setAttribute('name', 'attr_damage_redux');
dr_label.children[0].children[1].setAttribute('title', '@{damage_redux}');
const ac_setting_grid = ac_section_div.children[9];
ac_setting_grid.removeChild(ac_setting_grid.children[4]);
const dr_setting_label = ac_setting_grid.children[5].cloneNode(true);
ac_setting_grid.insertBefore(dr_setting_label, ac_setting_grid.children[6]);
dr_setting_label.children[0].innerText = 'dr (b, s, p)';
dr_setting_label.children[1].name = 'attr_damage_redux';
dr_setting_label.children[1].title = '@{damage_redux}';
dr_label.children[0].children[1].innerText = dr_setting_label.children[1].value || '0';
dr_setting_label.children[1].addEventListener('change', function(event) {dr_label.children[0].children[1].innerText = dr_setting_label.children[1].value || '0';});
ac_setting_grid.removeChild(ac_setting_grid.children[9]);
ac_setting_grid.children[7].children[0].innerText = 'dexterity penalty';
ac_setting_grid.children[8].children[0].innerText = 'stealth penalty';
ac_setting_grid.children[8].children[1].name = 'attr_armor_stealth_penalty';
ac_setting_grid.children[8].children[1].title = '@{armor_stealth_penalty}';
const stealth_armor_input = charactersheet.querySelector('input[name="attr_stealth_armor"]');
const stealth_armor_span = charactersheet.querySelector('span[name="attr_stealth_armor"]');
ac_setting_grid.children[8].children[1].addEventListener('change', function(event) { stealth_armor_input.value = event.target.value; stealth_armor_input.dispatchEvent(new Event('blur', { bubbles: true }));});
ac_setting_grid.children[7].children[1].setAttribute('disabled', '');


// Remove shield section
const armor_section_div = charactersheet.querySelector('div.armorclass.background-color');
const armor_section_horidivider_div = armor_section_div.children[4]
const armor_section_shiled_div = armor_section_div.children[5]
armor_section_div.removeChild(armor_section_horidivider_div);
armor_section_div.removeChild(armor_section_shiled_div);


// Saving Throws
const saving_buttons_div = charactersheet.querySelector('div.savingthrows.background-color');
const saving_buttons_display_div = saving_buttons_div.children[1];
const saving_buttons_settings_div = saving_buttons_div.children[2];
saving_buttons_display_div.appendChild(saving_buttons_display_div.children[1].cloneNode(true));
saving_buttons_display_div.appendChild(saving_buttons_display_div.children[1].cloneNode(true));
saving_buttons_display_div.appendChild(saving_buttons_display_div.children[1].cloneNode(true));
saving_buttons_settings_div.removeChild(saving_buttons_settings_div.children[3]);
saving_buttons_settings_div.removeChild(saving_buttons_settings_div.children[3]);
saving_buttons_settings_div.removeChild(saving_buttons_settings_div.children[3]);
saving_buttons_settings_div.appendChild(saving_buttons_settings_div.children[0].cloneNode(true));
saving_buttons_settings_div.appendChild(saving_buttons_settings_div.children[0].cloneNode(true));
saving_buttons_settings_div.appendChild(saving_buttons_settings_div.children[0].cloneNode(true));
style_element.textContent = style_element.textContent.replace('.charsheet .base-sheets div.savingthrows div.display {\n  grid-template-columns: 1fr 1fr 1fr;', '.charsheet .base-sheets div.savingthrows div.display {\n  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;');
style_element.textContent = style_element.textContent.replace('.charsheet .base-sheets div.savingthrows div > button[type=roll], .charsheet .base-sheets div.savingthrows .info-warning-message div > button[type=action].paths, .charsheet .base-sheets .info-warning-message div.savingthrows div > button[type=action].paths, .charsheet .base-sheets div.savingthrows .info-warning-message div > button.close-modal, .charsheet .base-sheets .info-warning-message div.savingthrows div > button.close-modal {\n  font-size: 1em;\n  margin: 0.4em 0;\n  width: 100%;', '.charsheet .base-sheets div.savingthrows div > button[type=roll], .charsheet .base-sheets div.savingthrows .info-warning-message div > button[type=action].paths, .charsheet .base-sheets .info-warning-message div.savingthrows div > button[type=action].paths, .charsheet .base-sheets div.savingthrows .info-warning-message div > button.close-modal, .charsheet .base-sheets .info-warning-message div.savingthrows div > button.close-modal {\n  font-size: 1em;\n  margin: 0.4em 0;\n  width: 80%;');
style_element.textContent = style_element.textContent.replace('.charsheet .base-sheets div.savingthrows div.display div.circle {\n  font-size: 1.7em;\n  font-weight: bold;\n  height: 2.5em;\n  padding: 5% 3%;\n  width: 2.5em;', '.charsheet .base-sheets div.savingthrows div.display div.circle {\n  font-size: 1.7em;\n  font-weight: bold;\n  height: 2em;\n  padding: 5% 3%;\n  width: 2em;');
style_element.textContent = style_element.textContent.replace('.charsheet .base-sheets div.savingthrows div.settings div.grid {\n  grid-template-columns: 1fr 1fr;', '.charsheet .base-sheets div.savingthrows div.settings div.grid {\n  grid-template-columns: 1fr;');
style_element.textContent = style_element.textContent.replace('.charsheet .base-sheets div.savingthrows div.settings {\n  grid-template-columns: 1fr 1fr 1fr;', '.charsheet .base-sheets div.savingthrows div.settings {\n  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;');
saving_buttons_display_div.children[1].outerHTML = saving_buttons_display_div.children[1].outerHTML.replace('{header=^{fortitude}}', '{header=Strength}');
saving_buttons_display_div.children[1].outerHTML = saving_buttons_display_div.children[1].outerHTML.replaceAll('fortitude', 'savingstr');
saving_buttons_display_div.children[2].outerHTML = saving_buttons_display_div.children[2].outerHTML.replace('{header=^{reflex}}', '{header=Dexterity}');
saving_buttons_display_div.children[2].outerHTML = saving_buttons_display_div.children[2].outerHTML.replaceAll('reflex', 'savingdex');
saving_buttons_display_div.children[3].outerHTML = saving_buttons_display_div.children[3].outerHTML.replace('{header=^{will}}', '{header=Constitution}');
saving_buttons_display_div.children[3].outerHTML = saving_buttons_display_div.children[3].outerHTML.replaceAll('will', 'savingcon');
saving_buttons_display_div.children[4].outerHTML = saving_buttons_display_div.children[4].outerHTML.replace('{header=^{fortitude}}', '{header=Intelligence}');
saving_buttons_display_div.children[4].outerHTML = saving_buttons_display_div.children[4].outerHTML.replaceAll('fortitude', 'savingint');
saving_buttons_display_div.children[5].outerHTML = saving_buttons_display_div.children[5].outerHTML.replace('{header=^{fortitude}}', '{header=Wisdom}');
saving_buttons_display_div.children[5].outerHTML = saving_buttons_display_div.children[5].outerHTML.replaceAll('fortitude', 'savingwis');
saving_buttons_display_div.children[6].outerHTML = saving_buttons_display_div.children[6].outerHTML.replace('{header=^{fortitude}}', '{header=Charisma}');
saving_buttons_display_div.children[6].outerHTML = saving_buttons_display_div.children[6].outerHTML.replaceAll('fortitude', 'savingcha');
saving_buttons_display_div.children[1].children[0].textContent = 'STR'
saving_buttons_display_div.children[2].children[0].textContent = 'DEX'
saving_buttons_display_div.children[3].children[0].textContent = 'CON'
saving_buttons_display_div.children[4].children[0].textContent = 'INT'
saving_buttons_display_div.children[5].children[0].textContent = 'WIS'
saving_buttons_display_div.children[6].children[0].textContent = 'CHA'

saving_buttons_settings_div.children[0].removeChild(saving_buttons_settings_div.children[0].children[0]);
saving_buttons_settings_div.children[0].outerHTML = saving_buttons_settings_div.children[0].outerHTML.replaceAll('fortitude', 'savingstr');
var dropdown_temp = saving_buttons_settings_div.children[0].children[0];
dropdown_temp.innerHTML = dropdown_temp.innerHTML.replace(' selected="selected"', '');
dropdown_temp.innerHTML = dropdown_temp.innerHTML.replace('@{strength_modifier}"', '@{strength_modifier}" selected="selected"');

saving_buttons_settings_div.children[1].removeChild(saving_buttons_settings_div.children[1].children[0]);
saving_buttons_settings_div.children[1].outerHTML = saving_buttons_settings_div.children[1].outerHTML.replaceAll('reflex', 'savingdex');
dropdown_temp = saving_buttons_settings_div.children[1].children[0];
dropdown_temp.innerHTML = dropdown_temp.innerHTML.replace(' selected="selected"', '');
dropdown_temp.innerHTML = dropdown_temp.innerHTML.replace('@{dexterity_modifier}"', '@{dexterity_modifier}" selected="selected"');

saving_buttons_settings_div.children[2].removeChild(saving_buttons_settings_div.children[2].children[0]);
saving_buttons_settings_div.children[2].outerHTML = saving_buttons_settings_div.children[2].outerHTML.replaceAll('will', 'savingcon');
dropdown_temp = saving_buttons_settings_div.children[2].children[0];
dropdown_temp.innerHTML = dropdown_temp.innerHTML.replace(' selected="selected"', '');
dropdown_temp.innerHTML = dropdown_temp.innerHTML.replace('@{constitution_modifier}"', '@{constitution_modifier}" selected="selected"');

saving_buttons_settings_div.children[3].removeChild(saving_buttons_settings_div.children[3].children[0]);
saving_buttons_settings_div.children[3].outerHTML = saving_buttons_settings_div.children[3].outerHTML.replaceAll('fortitude', 'savingint');
dropdown_temp = saving_buttons_settings_div.children[3].children[0];
dropdown_temp.innerHTML = dropdown_temp.innerHTML.replace(' selected="selected"', '');
dropdown_temp.innerHTML = dropdown_temp.innerHTML.replace('@{intelligence_modifier}"', '@{intelligence_modifier}" selected="selected"');

saving_buttons_settings_div.children[4].removeChild(saving_buttons_settings_div.children[4].children[0]);
saving_buttons_settings_div.children[4].innerHTML = saving_buttons_settings_div.children[4].innerHTML.replaceAll('fortitude', 'savingwis');
dropdown_temp = saving_buttons_settings_div.children[4].children[0];
dropdown_temp.innerHTML = dropdown_temp.innerHTML.replace(' selected="selected"', '');
dropdown_temp.innerHTML = dropdown_temp.innerHTML.replace('@{wisdom_modifier}"', '@{wisdom_modifier}" selected="selected"');

saving_buttons_settings_div.children[5].removeChild(saving_buttons_settings_div.children[5].children[0]);
saving_buttons_settings_div.children[5].innerHTML = saving_buttons_settings_div.children[5].innerHTML.replaceAll('fortitude', 'savingcha');
dropdown_temp = saving_buttons_settings_div.children[5].children[0];
dropdown_temp.innerHTML = dropdown_temp.innerHTML.replace(' selected="selected"', '');
dropdown_temp.innerHTML = dropdown_temp.innerHTML.replace('@{charisma_modifier}"', '@{charisma_modifier}" selected="selected"');

const str_mod_input = charactersheet.querySelector('input[name="attr_strength_modifier"][type="hidden"]');
const dex_mod_input = charactersheet.querySelector('input[name="attr_dexterity_modifier"][type="hidden"]');
const con_mod_input = charactersheet.querySelector('input[name="attr_constitution_modifier"][type="hidden"]');
const int_mod_input = charactersheet.querySelector('input[name="attr_intelligence_modifier"][type="hidden"]');
const wis_mod_input = charactersheet.querySelector('input[name="attr_wisdom_modifier"][type="hidden"]');
const cha_mod_input = charactersheet.querySelector('input[name="attr_charisma_modifier"][type="hidden"]');
const savingstr_input = str_mod_input.cloneNode(false);
const savingdex_input = dex_mod_input.cloneNode(false);
const savingcon_input = con_mod_input.cloneNode(false);
const savingint_input = int_mod_input.cloneNode(false);
const savingwis_input = wis_mod_input.cloneNode(false);
const savingcha_input = cha_mod_input.cloneNode(false);
savingstr_input.setAttribute('name', 'attr_saving_throws_savingstr');
savingdex_input.setAttribute('name', 'attr_saving_throws_savingdex');
savingcon_input.setAttribute('name', 'attr_saving_throws_savingcon');
savingint_input.setAttribute('name', 'attr_saving_throws_savingint');
savingwis_input.setAttribute('name', 'attr_saving_throws_savingwis');
savingcha_input.setAttribute('name', 'attr_saving_throws_savingcha');
const fortitude_input = charactersheet.querySelector('input[name="attr_saving_throws_fortitude"][type="hidden"]');
charactersheet.insertBefore(savingstr_input, fortitude_input);
charactersheet.insertBefore(savingdex_input, fortitude_input);
charactersheet.insertBefore(savingcon_input, fortitude_input);
charactersheet.insertBefore(savingint_input, fortitude_input);
charactersheet.insertBefore(savingwis_input, fortitude_input);
charactersheet.insertBefore(savingcha_input, fortitude_input);

function recalcSaving(savingtype, ability)
{
  const rank_chars = ['', 'T', 'E', 'M', 'L'];
  const rank_select = saving_buttons_settings_div.querySelector('select[name="attr_saving_throws_' + savingtype + '_rank"]');
  const item_input = saving_buttons_settings_div.querySelector('input[name="attr_saving_throws_' + savingtype + '_item"]');
  const temp_input = saving_buttons_settings_div.querySelector('input[name="attr_saving_throws_' + savingtype + '_temporary"]');
  const saving_mod_label = saving_buttons_display_div.querySelector('span[name="attr_saving_throws_' + savingtype + '"]');
  const saving_rank_label = saving_mod_label.previousSibling;
  const saving_button = saving_mod_label.parentElement.previousElementSibling;
  var saving_mod_val = parseInt(rank_select.options[rank_select.selectedIndex].value);
  saving_rank_label.innerText = rank_chars[saving_mod_val/2];
  saving_mod_val += parseInt(item_input.value);
  saving_mod_val += parseInt(temp_input.value);
  saving_mod_val += parseInt(charactersheet.querySelector('input[name="attr_' + ability + '_modifier"]').value);
  charactersheet.querySelector('input[name="attr_saving_throws_' + savingtype + '"][type="hidden"]').setAttribute('value', saving_mod_val);
  saving_mod_label.innerText = saving_mod_val;
  saving_button.setAttribute('value', '@{whispertype} &{template:rolls} {{limit_height=@{roll_limit_height}}} {{charactername=@{character_name}}} {{header=' + ability + '}} {{subheader=^{saving_throw}}} {{roll01=[[1d20cs20cf1 + (' + saving_mod_val + ')[saving throw mod]]]}} {{roll01_type=saving-throw}}');
}

saving_buttons_settings_div.children[0].addEventListener('change', function() { recalcSaving('savingstr', 'strength'); });
saving_buttons_settings_div.children[1].addEventListener('change', function() { recalcSaving('savingdex', 'dexterity'); });
saving_buttons_settings_div.children[2].addEventListener('change', function() { recalcSaving('savingcon', 'constitution'); });
saving_buttons_settings_div.children[3].addEventListener('change', function() { recalcSaving('savingint', 'intelligence'); });
saving_buttons_settings_div.children[4].addEventListener('change', function() { recalcSaving('savingwis', 'wisdom'); });
saving_buttons_settings_div.children[5].addEventListener('change', function() { recalcSaving('savingcha', 'charisma'); });

new MutationObserver(function() { recalcSaving('savingstr', 'strength'); }).observe(str_mod_input, { attributes: true });
new MutationObserver(function() { recalcSaving('savingdex', 'dexterity'); }).observe(dex_mod_input, { attributes: true });
new MutationObserver(function() { recalcSaving('savingcon', 'constitution'); }).observe(con_mod_input, { attributes: true });
new MutationObserver(function() { recalcSaving('savingint', 'intelligence'); }).observe(int_mod_input, { attributes: true });
new MutationObserver(function() { recalcSaving('savingwis', 'wisdom'); }).observe(wis_mod_input, { attributes: true });
new MutationObserver(function() { recalcSaving('savingcha', 'charisma'); }).observe(cha_mod_input, { attributes: true });


// Skill checks
const skill_buttons_div = charactersheet.querySelector('div.skills.background-color');
const skill_slots = new Array(16);
const skill_slot_grids = new Array(16);

for(var i = 0; i < 16; i++)
{
  skill_slots[i] = skill_buttons_div.children[i*2+1];
  skill_slot_grids[i] = skill_buttons_div.children[i*2+2];
}

skill_slot_0_buttons = skill_slots[0].children[1];
skill_slot_0_buttons.removeChild(skill_slot_0_buttons.children[1]);
skill_slot_0_buttons.removeChild(skill_slot_0_buttons.children[1]);
skill_slot_2_buttons = skill_slots[2].children[1];
skill_slot_2_buttons.removeChild(skill_slot_2_buttons.children[1]);
skill_slot_2_buttons.removeChild(skill_slot_2_buttons.children[1]);
skill_buttons_div.insertBefore(skill_slots[2], skill_buttons_div.children[33]);
skill_buttons_div.insertBefore(skill_slot_grids[2], skill_buttons_div.children[33]);
skill_buttons_div.insertBefore(skill_slots[0], skill_buttons_div.children[33]);
skill_buttons_div.insertBefore(skill_slot_grids[0], skill_buttons_div.children[33]);
skill_buttons_div.insertBefore(skill_slots[15], skill_buttons_div.children[33]);
skill_buttons_div.insertBefore(skill_slot_grids[15], skill_buttons_div.children[33]);
skill_buttons_div.insertBefore(skill_slots[13], skill_buttons_div.children[33]);
skill_buttons_div.insertBefore(skill_slot_grids[13], skill_buttons_div.children[33]);
skill_buttons_div.insertBefore(skill_slots[1], skill_buttons_div.children[33]);
skill_buttons_div.insertBefore(skill_slot_grids[1], skill_buttons_div.children[33]);
skill_buttons_div.insertBefore(skill_slots[9], skill_buttons_div.children[33]);
skill_buttons_div.insertBefore(skill_slot_grids[9], skill_buttons_div.children[33]);
skill_buttons_div.insertBefore(skill_slots[12], skill_buttons_div.children[33]);
skill_buttons_div.insertBefore(skill_slot_grids[12], skill_buttons_div.children[33]);
skill_buttons_div.insertBefore(skill_slots[7], skill_buttons_div.children[33]);
skill_buttons_div.insertBefore(skill_slot_grids[7], skill_buttons_div.children[33]);
skill_buttons_div.insertBefore(skill_slots[8], skill_buttons_div.children[33]);
skill_buttons_div.insertBefore(skill_slot_grids[8], skill_buttons_div.children[33]);
skill_buttons_div.insertBefore(skill_slots[14], skill_buttons_div.children[33]);
skill_buttons_div.insertBefore(skill_slot_grids[14], skill_buttons_div.children[33]);
skill_buttons_div.insertBefore(skill_slots[4], skill_buttons_div.children[33]);
skill_buttons_div.insertBefore(skill_slot_grids[4], skill_buttons_div.children[33]);
skill_buttons_div.insertBefore(skill_slots[6], skill_buttons_div.children[33]);
skill_buttons_div.insertBefore(skill_slot_grids[6], skill_buttons_div.children[33]);
skill_buttons_div.insertBefore(skill_slots[10], skill_buttons_div.children[33]);
skill_buttons_div.insertBefore(skill_slot_grids[10], skill_buttons_div.children[33]);
skill_buttons_div.insertBefore(skill_slots[11], skill_buttons_div.children[33]);
skill_buttons_div.insertBefore(skill_slot_grids[11], skill_buttons_div.children[33]);
skill_buttons_div.insertBefore(skill_slots[3], skill_buttons_div.children[33]);
skill_buttons_div.insertBefore(skill_slot_grids[3], skill_buttons_div.children[33]);
skill_buttons_div.removeChild(skill_slots[5]);
skill_buttons_div.removeChild(skill_slot_grids[5]);

for(var i = 0; i < 15; i++)
{
  skill_slots[i] = skill_buttons_div.children[i*2+1];
  skill_slot_grids[i] = skill_buttons_div.children[i*2+2];
}

skill_slots[2].children[1].textContent = 'sleight of hand'
skill_slots[2].children[1].value = skill_slots[2].children[1].value.replace('{header=^{thievery}}', '{header=sleight of hand}');
skill_slots[5].children[1].textContent = 'investigation'
skill_slots[5].children[1].value = skill_slots[5].children[1].value.replace('{header=^{occultism}}', '{header=investigation}');
skill_slots[7].children[1].textContent = 'animal handling'
skill_slots[7].children[1].value = skill_slots[7].children[1].value.replace('{header=^{medicine}}', '{header=animal handling}');
skill_slots[8].children[1].textContent = 'insight'
skill_slots[8].children[1].value = skill_slots[8].children[1].value.replace('{header=^{nature}}', '{header=insight}');
skill_slots[13].children[1].textContent = 'persuasion'
skill_slots[13].children[1].value = skill_slots[13].children[1].value.replace('{header=^{religion}}', '{header=persuasion}');
skill_slot_grids[0].children[5].children[1].value = '0';
skill_slot_grids[1].children[5].children[1].value = '0';
skill_slot_grids[2].children[5].children[1].value = '0';
skill_slots[0].removeChild(skill_slots[0].children[9]);
skill_slots[1].removeChild(skill_slots[1].children[9]);
skill_slots[2].removeChild(skill_slots[2].children[9]);
skill_slot_grids[0].removeChild(skill_slot_grids[0].children[5]);
skill_slot_grids[1].removeChild(skill_slot_grids[1].children[5]);
skill_slot_grids[2].removeChild(skill_slot_grids[2].children[5]);
skill_slot_grids[3].children[5].style = 'display: none;';
style_element.textContent = style_element.textContent.replace('\n.charsheet .base-sheets input.custom-override[value=on] + label.sublabel span.sublabel {\n  display: flex;\n  justify-content: space-around;\n  background-color: hsl(0deg, 0%, 0%);\n}', '');


// Features
pc_tabs.children[2].children[1].innerText = 'features';
const features_tab = charactersheet.querySelector('div.feats');
const features_tab_lcol = features_tab.children[0];
const features_tab_rcol = features_tab.children[1];
features_tab_lcol.removeChild(features_tab_lcol.children[2]);
features_tab_lcol.children[0].children[3].innerText = 'racial traits'
features_tab_lcol.children[1].children[3].innerText = 'class features'
features_tab_rcol.children[0].children[3].innerText = 'feats'
features_tab_rcol.children[1].children[3].innerText = 'extra abilities'

for(features_setting_grid of features_tab_lcol.querySelectorAll('div.grid.feats-repeating-grid.settings'))
{
  features_setting_grid.previousElementSibling.children[1].style = 'grid-column: 1/4;';
  features_setting_grid.previousElementSibling.removeChild(features_setting_grid.previousElementSibling.children[2]);
  for(i = 0; i < 8; i++)
    features_setting_grid.removeChild(features_setting_grid.children[3]);
  features_setting_grid.removeChild(features_setting_grid.children[1]);
  features_setting_grid.children[0].style = 'grid-column: 1/3;';
  features_setting_grid.children[2].children[1].style = 'height:6em;';
  const feature_roll_button = features_setting_grid.previousElementSibling.children[1];
  let roll_text = feature_roll_button.value;
  roll_text = roll_text.replace(/ {{info01_name=.* {{info02_\s*/gs, ' {{info02_');
  roll_text = roll_text.replace(/{{info03_name=.*_special}}}\s*/gs, '');
  roll_text = roll_text.replace(/ {{show_action_icon=@.*_action}}}\s*/gs, '');
  roll_text = roll_text.replace('^{ancestry_feats_and_abilities}', 'racial trait');
  roll_text = roll_text.replace('^{skill_feats}', 'class feature');
  feature_roll_button.value = roll_text;
}

for(features_setting_grid of features_tab_rcol.children[0].querySelectorAll('div.grid.feats-repeating-grid.settings'))
{
  features_setting_grid.previousElementSibling.children[1].style = 'grid-column: 1/4;';
  features_setting_grid.previousElementSibling.removeChild(features_setting_grid.previousElementSibling.children[2]);
  for(i = 0; i < 8; i++)
    features_setting_grid.removeChild(features_setting_grid.children[3]);
  features_setting_grid.removeChild(features_setting_grid.children[1]);
  features_setting_grid.children[0].style = 'grid-column: 1/3;';
  features_setting_grid.children[2].children[1].style = 'height:6em;';
  const feature_roll_button = features_setting_grid.previousElementSibling.children[1];
  let roll_text = feature_roll_button.value;
  roll_text = roll_text.replace(/ {{info01_name=.*_type}}}\s*/gs, '');
  roll_text = roll_text.replace(/{{info03_name=.*_special}}}\s*/gs, '');
  roll_text = roll_text.replace(/ {{show_action_icon=@.*_action}}}\s*/gs, '');
  roll_text = roll_text.replace('^{class_feats_and_abilities}', 'feat');
  feature_roll_button.value = roll_text;
}

for(features_setting_grid of features_tab_rcol.children[1].querySelectorAll('div.grid.feats-repeating-grid.settings'))
{
  for(i = 0; i < 8; i++)
    features_setting_grid.removeChild(features_setting_grid.children[2]);
  features_setting_grid.children[2].children[1].style = 'height:6em;';
  const feature_roll_button = features_setting_grid.previousElementSibling.children[1];
  let roll_text = feature_roll_button.value;
  roll_text = roll_text.replace(/{{info03_name=.*_special}}}\s*/gs, '');
  roll_text = roll_text.replace(/ {{show_action_icon=@.*_action}}}\s*/gs, '');
  roll_text = roll_text.replace('^{class_feats_and_abilities}', 'feat');
  roll_text = roll_text.replace('^{bonus_feats}', 'extra ability');
  feature_roll_button.value = roll_text;
}


// Inventory tab redesign
const inventory_tab = charactersheet.querySelector('div.inventory');
style_element.textContent = style_element.textContent.replace('grid-template-columns: 1fr 2.5fr 2.5fr 1fr 1fr 1fr 1fr;\n  margin: 1%;\n  width: 100%;', 'grid-template-columns: 0.8fr 1fr 2.5fr 2.5fr 0.5fr 0.5fr 0.5fr 0.5fr;\n  margin: 1%;\n  width: 97.5%;');
style_element.textContent = style_element.textContent.replace('inv-top-row .coins {\n  grid-row: 1/5;', 'inv-top-row .coins {\n  grid-row: 2/3;');
const inventory_summary_section = inventory_tab.children[0].children[1];
inventory_summary_section.removeChild(inventory_summary_section.children[7]);
inventory_summary_section.removeChild(inventory_summary_section.children[7]);
const inventory_size_select_div = inventory_summary_section.children[1].cloneNode(true);
inventory_size_select_div.removeChild(inventory_size_select_div.children[0]);
inventory_size_select_div.removeChild(inventory_size_select_div.children[0]);
inventory_size_select_div.removeChild(inventory_size_select_div.children[1]);
inventory_size_select_div.children[0].innerText = 'Character Size';
inventory_size_select_div.setAttribute('style', "grid-template-columns: 1fr;grid-template-rows: 2fr 1fr;");
inventory_summary_section.insertBefore(inventory_size_select_div, inventory_summary_section.children[1]);
const size_select_html = '<select name="attr_character_size" title="@{character_size}"><option data-i18n="Tiny" value="1">Tiny</option><option data-i18n="Small" value="2">Small</option><option data-i18n="Medium" value="2" selected="selected">Medium</option><option data-i18n="Large" value="4">Large</option><option data-i18n="Huge" value="8">Huge</option><option data-i18n="Gargantuan" value="16">Gargantuan</option></select>';
inventory_size_select_div.children[0].insertAdjacentHTML('afterend', size_select_html);


// Inventory capacities
style_element.textContent = style_element.textContent.replace('.charsheet .base-sheets div.inventory div.encumbered div.circle {\n', '.charsheet .base-sheets div.inventory div.encumbered div.circle {\n white-space: nowrap;\n');
inventory_tab.querySelector('div.circle.bulk-circle').children[0].children[0].innerText = 'Carry';
const cap_display_divs = inventory_tab.querySelectorAll('div.encumbered');
const encumbered_cap_label = cap_display_divs[1].children[0].children[0];
const maximum_cap_label = cap_display_divs[2].children[0].children[0];
const character_size_select = inventory_size_select_div.children[1];
cap_display_divs[1].children[3].children[0].children[0].innerText = 'mult';
cap_display_divs[1].children[3].children[0].children[1].innerText = '15';
cap_display_divs[2].children[3].children[0].children[0].innerText = 'mult';
cap_display_divs[2].children[3].children[0].children[1].innerText = '30';
const encumbered_str_span = cap_display_divs[1].children[3].children[1].children[1];
const maximum_str_span = cap_display_divs[2].children[3].children[1].children[1];
encumbered_str_span.setAttribute('name', 'attr_strength');
maximum_str_span.setAttribute('name', 'attr_strength');
const encumbered_mod_input = cap_display_divs[1].children[3].children[2].children[1];
const maximum_mod_input = cap_display_divs[2].children[3].children[2].children[1];
encumbered_mod_input.name = 'attr_encumbered_mod';
maximum_mod_input.name = 'attr_maximum_mod';

function updateEncumberedCap()
{
  let cap = parseInt(encumbered_str_span.innerText);
  cap *= parseInt(character_size_select.options[character_size_select.selectedIndex].value) * 7.5;
  cap = Math.floor(cap);
  cap += parseInt(encumbered_mod_input.value);
  encumbered_cap_label.innerText = cap;
}

function updateMaximumCap()
{
  let cap = parseInt(maximum_str_span.innerText);
  cap *= parseInt(character_size_select.options[character_size_select.selectedIndex].value) * 15;
  cap = Math.floor(cap);
  cap += parseInt(maximum_mod_input.value);
  maximum_cap_label.innerText = cap;
}

character_size_select.addEventListener('change', function(){updateEncumberedCap();updateMaximumCap();});
encumbered_mod_input.addEventListener('change', updateEncumberedCap);
maximum_mod_input.addEventListener('change', updateMaximumCap);
new MutationObserver(updateEncumberedCap).observe(encumbered_str_span, { childList: true });
new MutationObserver(updateMaximumCap).observe(maximum_str_span, { childList: true });


// Inventory item section
let _temp_style_text = style_element.textContent;
_temp_style_text = _temp_style_text.replace('label.inv-other {\n  grid-area: 4/1/4/7;', 'label.inv-other {\n  grid-area: 4/1/4/4;');
_temp_style_text = _temp_style_text.replace('label.inv-notes {\n  grid-area: 5/1/5/7;', 'label.inv-notes {\n  grid-area: 4/4/4/7;');
_temp_style_text = _temp_style_text.replace('label.inv-other textarea', 'label textarea');
_temp_style_text = _temp_style_text.replace('grid-template-columns: 4fr 0.5fr 1fr 1fr 1fr 0.5fr;', 'grid-template-columns: 4fr 0.1fr 1fr 1fr 1fr 0.5fr;');
_temp_style_text = _temp_style_text.replace('.charsheet .base-sheets div.inventory div.item-repeating-grid label.inv-name,\n.charsheet .base-sheets div.inventory div.item-repeating-grid label.inv-price,\n.charsheet .base-sheets div.inventory div.item-repeating-grid label.inv-bulk {\n  grid-row: 1;\n}', '.charsheet .base-sheets div.inventory div.item-repeating-grid label.inv-name,\n.charsheet .base-sheets div.inventory div.item-repeating-grid label.inv-invest,\n.charsheet .base-sheets div.inventory div.item-repeating-grid label.inv-capacity,\n.charsheet .base-sheets div.inventory div.item-repeating-grid label.inv-bulk {\n  grid-row: 1;\n}');
_temp_style_text = _temp_style_text.replace('.charsheet .base-sheets div.inventory div.item-repeating-grid label.inv-traits,\n.charsheet .base-sheets div.inventory div.item-repeating-grid label.inv-level {\n  grid-row: 2;\n}', '.charsheet .base-sheets div.inventory div.item-repeating-grid label.inv-traits,\n.charsheet .base-sheets div.inventory div.item-repeating-grid label.inv-broken,\n.charsheet .base-sheets div.inventory div.item-repeating-grid label.inv-price {\n  grid-row: 2;\n}');
_temp_style_text = _temp_style_text.replace('.charsheet .base-sheets div.inventory div.item-repeating-grid label.inv-invest,\n.charsheet .base-sheets div.inventory div.item-repeating-grid label.inv-hardness,\n.charsheet .base-sheets div.inventory div.item-repeating-grid label.inv-hitpoints,\n.charsheet .base-sheets div.inventory div.item-repeating-grid label.inv-bt,\n.charsheet .base-sheets div.inventory div.item-repeating-grid label.inv-broken,\n.charsheet .base-sheets div.inventory div.item-repeating-grid label.inv-capacity {\n  grid-row: 3;\n}\n', '');
_temp_style_text = _temp_style_text.replace('label.inv-name {\n  grid-column: 1/5;', 'label.inv-name {\n  grid-column: 1/4;');
_temp_style_text = _temp_style_text.replace('.charsheet .base-sheets div.inventory div.item-repeating-grid label.inv-capacity {\n  grid-column: 5;\n}\n', '');
_temp_style_text = _temp_style_text.replace('inv-traits {\n  grid-column: 1/6;', 'inv-traits {\n  grid-column: 1/5;');
_temp_style_text = _temp_style_text.replace('.charsheet .base-sheets div.inventory div.item-repeating-grid label.inv-bulk {\n  grid-column: 6;\n}\n', '');
style_element.textContent = _temp_style_text = _temp_style_text;

const item_list_header_grids = inventory_tab.querySelectorAll('div.grid.inv-display-grid.header');
item_list_header_grids[0].children[1].children[1].innerText = 'attune';
item_list_header_grids[0].children[2].children[0].innerText = 'weight';
item_list_header_grids[1].children[1].children[0].innerText = 'attune';
item_list_header_grids[1].children[2].children[0].innerText = 'weight';
item_list_header_grids[2].children[1].innerText = 'charge';
item_list_header_grids[2].children[2].children[0].innerText = 'weight';
const item_setting_grids = inventory_tab.querySelectorAll('div.grid.item-repeating-grid.settings');

window.updateInvWeightDisplay = function(event_target)
{
  let cur_repitem = event_target;
  if(cur_repitem.className != 'repitem') cur_repitem = cur_repitem.parentElement;
  const inv_type_str = cur_repitem.parentElement.getAttribute('data-groupname').split('-')[1];
  const cur_weight_input = cur_repitem.querySelector('input[name="attr_' + inv_type_str + '_bulk_fixed"');
  const cur_bqty_input = cur_repitem.querySelector('input[name="attr_' + inv_type_str + '_bulk_quantity_fixed"');
  const cur_weight_display_span = cur_repitem.querySelector('[data-i18n-title="bulk and bulk quantity"]');
  if((parseInt(cur_bqty_input.value) || 1) == 1) cur_weight_display_span.children[0].innerText = (parseFloat(cur_weight_input.value) || 0);
  else cur_weight_display_span.children[0].innerText = (parseFloat(cur_weight_input.value) || 0) + '/' + cur_bqty_input.value;
  recalcItemSectionSum(inv_type_str);
}

function recalcItemSectionSum(inv_type_str)
{
  let weight = 0;

  const cur_item_section = inventory_tab.querySelector('div.inv-half-col.' + inv_type_str + '-items.compendium-drop-target');
  for(cur_repitem of cur_item_section.querySelectorAll('div.repitem'))
  {
    const item_display_div = cur_repitem.children[2];
    let cur_item_weight = 0;
    try { cur_item_weight = eval(item_display_div.children[5].children[0].innerText); }
    catch (err) { cur_item_weight = NaN }
    if(isNaN(cur_item_weight)) continue;
    const cur_item_qty = parseFloat(item_display_div.children[6].value);
    if(isNaN(cur_item_qty)) continue;
    weight += cur_item_weight * cur_item_qty;
  }

  cur_item_section.querySelector('span[name="attr_inventory_' + inv_type_str + '_total_bulk"]').innerText = Math.floor(weight);
  recalcCarry();
}

function recalcCarry()
{
  const weight_readied = parseInt(inventory_tab.querySelector('span[name="attr_inventory_readied_total_bulk"]').innerText);
  const weight_worn = parseInt(inventory_tab.querySelector('span[name="attr_inventory_worn_total_bulk"]').innerText);
  const weight_other = parseInt(inventory_tab.querySelector('span[name="attr_inventory_other_total_bulk"]').innerText);

  inventory_tab.querySelector('span[name="attr_bulk"]').innerText = weight_readied + weight_worn + weight_other;
}

function onMutationRepcontainer(mutationsList, observer)
{
  mutationsList.forEach(function(mutation) {
    if(mutation.removedNodes.length > 0) recalcCarry();
    mutation.addedNodes.forEach(function(node) {
      if (node.className == 'repitem') {
        updateInvWeightDisplay(node);
      }
    });
  });
}

for(repcontainer of inventory_tab.querySelectorAll('div.repcontainer'))
  new MutationObserver(onMutationRepcontainer).observe(repcontainer, { childList: true });

for(item_setting_grid of item_setting_grids)
{
  item_setting_grid.removeChild(item_setting_grid.children[4]);
  item_setting_grid.removeChild(item_setting_grid.children[4]);
  item_setting_grid.removeChild(item_setting_grid.children[4]);
  item_setting_grid.removeChild(item_setting_grid.children[4]);
  const inv_name_label = item_setting_grid.querySelector('label.inv-name');
  const inv_attune_label = item_setting_grid.querySelector('label[title="item invest (max 10)"]');
  const inv_charge_label = item_setting_grid.querySelector('label.inv-capacity');
  const inv_weight_label = item_setting_grid.querySelector('label.inv-bulk');
  const inv_bulkqty_label = item_setting_grid.querySelector('label[title="bulk quantity: how many items for its bulk"]');
  const inv_prop_label = item_setting_grid.querySelector('label.inv-traits');
  const inv_broken_label = item_setting_grid.querySelector('label.inv-broken');
  const inv_price_label = item_setting_grid.querySelector('label.inv-price');
  const inv_desc_label = item_setting_grid.querySelector('label.inv-other');
  const inv_memo_label = item_setting_grid.querySelector('label.inv-notes');
  const inv_display_div = item_setting_grid.previousElementSibling;
  const inv_display_weight_span = inv_display_div.children[5];
  const inv_display_qty_input = inv_display_div.children[6];
  item_setting_grid.insertBefore(inv_price_label, item_setting_grid.children[item_setting_grid.children.length-4]);
  item_setting_grid.insertBefore(inv_name_label, inv_price_label);

  if(inv_attune_label != null)
  {
    item_setting_grid.insertBefore(inv_attune_label, inv_price_label);
    inv_attune_label.children[0].innerText = 'attune';
    inv_attune_label.children[1].type = 'number';
    inv_attune_label.children[1].style.width = '100%';
  }

  if(inv_charge_label != null)
  {
    item_setting_grid.insertBefore(inv_charge_label, inv_price_label);
    inv_charge_label.children[0].innerText = 'charge';
    inv_charge_label.children[1].type = 'number';
    inv_charge_label.children[1].style.width = '100%';
  }

  item_setting_grid.insertBefore(inv_weight_label, inv_price_label);
  item_setting_grid.insertBefore(inv_bulkqty_label, inv_price_label);
  item_setting_grid.insertBefore(inv_prop_label, inv_price_label);
  item_setting_grid.insertBefore(inv_broken_label, inv_price_label);
  inv_weight_label.children[0].innerText = 'weight';
  inv_weight_label.children[1].name += '_fixed';
  inv_weight_label.children[1].type = 'number';
  inv_weight_label.children[1].style.width = '100%';
  inv_bulkqty_label.children[1].name += '_fixed';
  inv_bulkqty_label.children[1].type = 'number';
  inv_bulkqty_label.children[1].style.width = '100%';
  inv_prop_label.children[0].innerText = 'Properties';
  inv_desc_label.children[0].innerText = 'Description';
  inv_memo_label.children[0].innerText = 'Memo';
  inv_display_weight_span.removeChild(inv_display_weight_span.children[2]);
  inv_display_weight_span.removeChild(inv_display_weight_span.children[0]);
  inv_display_weight_span.children[0].setAttribute('name', 'attr_weight');
  inv_display_qty_input.name += '_fixed';
  inv_display_qty_input.setAttribute('onChange', 'updateInvWeightDisplay(event.target.parentElement.parentElement)');
  inv_weight_label.setAttribute('onChange', 'updateInvWeightDisplay(event.target.parentElement.parentElement)');
  inv_bulkqty_label.setAttribute('onChange', 'updateInvWeightDisplay(event.target.parentElement.parentElement)');

  if(inv_charge_label != null)
  {
    const inv_charge_display_label = inv_display_div.children[4];
    inv_charge_display_label.setAttribute('name', inv_charge_display_label.getAttribute('name').replace('capacity', 'charge'));
    inv_charge_label.children[1].name = inv_charge_label.children[1].name.replace('capacity', 'charge');
    inv_charge_label.children[1].title = inv_charge_label.children[1].title.replace('capacity', 'charge');
    inv_charge_label.children[1].setAttribute('onChange', 'event.target.parentElement.parentElement.previousElementSibling.children[4].innerText = event.target.value');
  }
}

const item_roll_buttons = inventory_tab.querySelectorAll('button[type="roll"]');

for(item_roll_button of item_roll_buttons)
{
  let item_roll_button_text = item_roll_button.value;
  item_roll_button_text = item_roll_button_text.replace('^{bulk}', 'weight');
  item_roll_button_text = item_roll_button_text.replace('^{traits}', 'properties');
  item_roll_button_text = item_roll_button_text.replace('^{invest}', 'Attunement');
  item_roll_button_text = item_roll_button_text.replace(/ {{info06_name=^{level}}}| {{info06=@{readied_level}}}| {{info06=@{worn_level}}}| {{info06=@{other_level}}}| {{notes=@{readied_item_notes}}}| {{notes=@{worn_item_notes}}}| {{notes=@{other_item_notes}}}/g, '');
  item_roll_button.value = item_roll_button_text;
}


// Spells tab
const spells_tab = charactersheet.querySelector('div.spells');
const spells_tab_lcol = spells_tab.children[0];
const spells_tab_rcol = spells_tab.children[1];
spells_tab_lcol.removeChild(spells_tab_lcol.children[3]);
spells_tab_lcol.removeChild(spells_tab_lcol.children[3]);
spells_tab_lcol.removeChild(spells_tab_lcol.children[3]);
spells_tab_rcol.removeChild(spells_tab_rcol.children[3]);
spells_tab_rcol.insertBefore(spells_tab_rcol.children[1], spells_tab_rcol.children[0]);
const toggle_section = spells_tab_lcol.children[3];
toggle_section.insertBefore(toggle_section.children[3], toggle_section.children[2]);
toggle_section.children[2].children[1].innerText = 'Spells';
toggle_section.removeChild(toggle_section.children[5]);
const spells_section = spells_tab_rcol.children[0];
spells_section.children[0].innerText = 'spells';
spells_section.children[2].children[0].innerText = 'spell resources';
spells_tab_lcol.children[3].children[3].children[1].innerText = 'extra spells';
spells_tab_rcol.children[1].children[0].innerText = 'extra spells';


// Spell DC fix
const spelldc_grid = spells_tab_lcol.children[1].children[4];
spelldc_grid.children[3].children[1].innerText = '8';
spelldc_grid.children[1].children[0].setAttribute('name', 'attr_spell_dc_fixed');
const spelldc_input = charactersheet.querySelector('input[type="hidden"][name="attr_spell_dc"]');
const spelldc_fixed_input = spelldc_input.cloneNode(false);
spelldc_fixed_input.setAttribute('name', 'attr_spell_dc_fixed');
spelldc_input.parentElement.insertBefore(spelldc_fixed_input, spelldc_input);
const spelldc_input_observer = new MutationObserver(function(mutationsList, observer) {
  const spelldc_input = charactersheet.querySelector('input[type="hidden"][name="attr_spell_dc"]');
  const spelldc_fixed_input = charactersheet.querySelector('input[type="hidden"][name="attr_spell_dc_fixed"]');
  const spelldc_fixed = spelldc_input.value - 2;
  spelldc_fixed_input.value = spelldc_fixed
  charactersheet.querySelector('span[name="attr_spell_dc_fixed"]').innerText = spelldc_fixed;
});
spelldc_input_observer.observe(spelldc_input, { attributes: true });
