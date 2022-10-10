const invite_buttons = document.getElementsByClassName('invite')
const faq_buttons = document.getElementsByClassName('faq')

for (let index = 0; index < invite_buttons.length; index++) {
    const element = invite_buttons[index];
    element.onclick = function() {
        document.location.assign('https://www.guilded.gg/b/unknown')
    }
}

for (let index = 0; index < faq_buttons.length; index++) {
    const element = faq_buttons[index];
    element.onclick = function() {
        document.location.assign('https://serverguard.reapimus.com/faq')
    }
}