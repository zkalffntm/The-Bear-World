// ==UserScript==
// @name        Exponential Overload Mana System
// @namespace   Violentmonkey Scripts
// @match       https://app.roll20.net/editor/character/15336305/*
// @version     0.1
// @author      MandarinKAMO
// @description 2023. 11. 24.
// ==/UserScript==

//const style_element = document.querySelector('head').querySelector('style[type="text/css"][title="charsheet"]');
//const script_section = document.querySelector('body').querySelector('script[type="text/javascript"]');
//const pc_tabs = charactersheet.querySelector('div.pc-tabs');

// 주문 초기비용 및 과부하 배수 설정
const initial_cost = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90] // 초기 비용
const cost_exponent = [0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9] // 과부하 배수

// 객체 추적
const charactersheet = document.querySelector('form.sheetform').children[0]
const pc_container = charactersheet.querySelector('div.container.pc')
const spell_page = pc_container.querySelector('div.page.spells')
const spell_page_body = spell_page.querySelector('div.body')

// 레이블 텍스트 변경
const span_manacost_text = spell_page_body.querySelector('span[data-i18n="slots_total-u"]')
span_manacost_text.textContent = '현재 마나 비용'
span_manacost_text.style = 'margin-right: 45px; font-size: 14px;'
const span_overload_text = spell_page_body.querySelector('span.spell-point-hide')
span_overload_text.textContent = '과부하'
span_overload_text.style = 'margin-right: 45px; font-size: 14px;'

// 자동 계산 기능 구현
const spell_level_titles = spell_page_body.querySelectorAll('div.spell-level')

window.updateManaCost = function(event_source)
{
  const current_spell_level_title = event_source.parentElement.parentElement;
  const label_spell_level = current_spell_level_title.querySelector('span.label')
  const span_mana_cost = current_spell_level_title.querySelector('div.total').children[0]
  const input_overload = current_spell_level_title.querySelector('input[type="number"]')
  const current_spell_level = parseInt(label_spell_level.textContent)
  const current_level_overload = parseInt(input_overload.value)
  let current_cost = initial_cost[current_spell_level]
  for(let i = 0; i < current_level_overload; i++)
    current_cost = Math.floor(current_cost * cost_exponent[current_spell_level])
  span_mana_cost.textContent = current_cost
}


for(let i = 1; i < spell_level_titles.length; i++)
{
  let current_input_overload = spell_level_titles[i].querySelector('input[type="number"]')
  current_input_overload.setAttribute('onChange', 'updateManaCost(event.target)')
  updateManaCost(current_input_overload)
}

