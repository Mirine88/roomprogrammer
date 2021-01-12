'use strict'

if (new Date().getMilliseconds() % 2 == 0) $("#programmer-emoji").text("👨‍💻")
else $("#programmer-emoji").text("👩‍💻")

const highlightBlock = () => $('pre code').each((_, block) => hljs.highlightBlock(block))

$.ajax({
    type: "GET",
    url: "http://roomprogrammerapi.herokuapp.com/discord",
    data: {
        prefix: "!",
        commands: "ping,piing",
        answers: "pong,poong",
    },
    success(resp) {
        console.log(resp)
        $("pre code").text(resp["result"])
        highlightBlock()
    },
})