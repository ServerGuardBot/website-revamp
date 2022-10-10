const header = document.getElementsByClassName('header')[0]
const footer = document.getElementsByTagName('footer')[0]

const header_content =
`<a class="img-link" href="https://serverguard.reapimus.com"><img src="images/logo.svg" alt="Site Logo" class="logo"></a>
<a class="nav first" href="https://www.guilded.gg/b/unknown">Invite</a>
<a class="nav" href="faq">FAQ</a>
<a class="nav" href="https://serverguard.reapimus.com/support">Support</a>
`
const footer_content =
`<p>Server Guard is not endorsed or created by Guilded</p>
<p>&copy; <a href="https://www.reapimus.com">Reapimus</a> ${new Date().getFullYear()}</p>
<p><a href="https://serverguard.reapimus.com/support">Support</a> • <a href="legal">Terms of Service</a></p>
`

const favicon = `<link rel="icon" type="image/x-icon" href="images/logo.svg">`
const font = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro">`

header.innerHTML = header_content
footer.innerHTML = footer_content

document.head.insertAdjacentHTML('beforeend', favicon)
document.head.insertAdjacentHTML('beforeend', font)