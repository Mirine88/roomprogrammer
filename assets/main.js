'use strict'

const langs = {
  "node.js": "js",
  python: "py",
  go: "go",
  java: "java",
  ruby: "rb",
  rust: "rs",
  c: "c",
  "c++": "cpp",
  "c#": "cs"
}
const apps = {
  helloworld: [
    "node.js",
    "python",
    "go",
    "java",
    "ruby",
    "rust",
    "c",
    "c++",
    "c#"
  ],
  discord: [
    "node.js",
    "python",
    "go",
    "ruby"
  ],
  web: [
    "node.js",
    "go"
  ]
}

// show char.
if (new Date().getMilliseconds() % 2 == 0) $("#programmer-emoji").text("👨‍💻")
else $("#programmer-emoji").text("👩‍💻")

// useLanguage and useApp change when language selector and app selector change
let useApp = "helloworld"
let useLanguage = "js"
$('#app-selector').change(() => {
  useApp = $('#app-selector').val()
  initCommand()
  changeFragment($('#app-selector').val())
  useLanguage = $('#language-selector').val()
});
$('#language-selector').change(() => useLanguage = $('#language-selector').val());

// fragment
function initFragment() {
  let list = []
  for (let i = 0; i < $('#app-selector option').length; i++)
    list.push($('#app-selector option')[i].attributes.value.textContent)

  if (list.indexOf(getFragment()) > -1) $('#app-selector').val(getFragment())
  useApp = $('#app-selector').val()
  initCommand()
  changeFragment($('#app-selector').val())
  useLanguage = $('#language-selector').val()
}
initFragment()

let oldFragment = ""
setInterval(() => {
  let nowFragment = getFragment()
  if (oldFragment !== nowFragment) {
    oldFragment = nowFragment
    initFragment()
  }
}, 10)

function getFragment() {
  const parts = location.href.split('#')
  return parts[1]
}

function changeFragment(fragment) {
  const parts = location.href.split('#')
  location.href = parts[0] + '#' + fragment
}

function highlightBlock() {
  $('pre code#result').attr('class', `${useLanguage} user-select-all`)
  $('pre code#result').each((_, block) => hljs.highlightBlock(block))
}

function _getCode(app, data) {
  function a() {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        url: "http://roomprogrammerapi.herokuapp.com/" + app,
        data: data,
        success(resp) {
          resolve(resp)
        },
        error(err) {
          reject(err)
        }
      })
    })
  }
  a().then(resp => {
    console.log(resp)
    $("pre code").text(resp["result"])
    highlightBlock()
    if (resp["message"] !== "ok") alert(resp["message"])
  })
}

function getDiscordCode() {
  const len = $("#keys-values > div").length
  let commands = []
  let answers = []
  for (let i = 1; i <= len; i++) {
    let command = $(`#keys-values > div:nth-child(${i}) .first`).val()
    let answer = $(`#keys-values > div:nth-child(${i}) .second`).val()
    if (command.indexOf(',') > -1 || answer.indexOf(',') > -1) {
      alert("콤마(,)는 명령어나 대답 자리에 들어갈 수 없습니다.")
      return
    }
    if (answers === '') {
      alert('비어있는 대답은 지원되지 않습니다.')
      return
    }
    commands.push(command)
    answers.push(answer)
  }

  const prefix = $("#inputs .input-group input").val()
  _getCode("discord", {
    language: useLanguage,
    prefix: prefix,
    commands: commands.join(','),
    answers: answers.join(',')
  })

  switch (useLanguage) {
    case "js":
      $('#remark').html('<a target="_blank" href="https://www.npmjs.com/package/discord.js">discord.js</a> 모듈 사용')
      break
    case "py":
      $('#remark').html('<a target="_blank" href="https://pypi.org/project/discord.py/">discord.py</a> 모듈 사용')
      break
    case "go":
      $('#remark').html('<a target="_blank" href="https://github.com/bwmarrin/discordgo">discordgo</a> 모듈 사용')
      break
    case "rb":
      $('#remark').html('<a target="_blank" href="https://github.com/shardlab/discordrb">discordrb</a> 모듈 사용')
      break
  }
  $('#remark').html($('#remark').html() + "<br>token은 보안상 직접 넣어주세요.")
}

function getWebCode() {
  const len = $("#keys-values > div").length
  let paths = []
  let values = []
  for (let i = 1; i <= len; i++) {
    let command = $(`#keys-values > div:nth-child(${i}) .first`).val()
    let answer = $(`#keys-values > div:nth-child(${i}) .second`).val()
    if (command.indexOf(',') > -1 || answer.indexOf(',') > -1) {
      alert("콤마(,)는 경로나 값에 들어갈 수 없습니다.")
      return
    }
    if (values === '') {
      alert('비어있는 대답은 지원되지 않습니다.')
      return
    }
    paths.push(command)
    values.push(answer)
  }

  _getCode('web', {
    language: useLanguage,
    paths: paths.join(','),
    values: values.join(',')
  })
  if (useLanguage === 'js') $('#remark').html('<a target="_blank" href="https://www.npmjs.com/package/express">express</a> 모듈 사용')
}

function getCode() {
  if (confirm('실제로 만드시겠습니까?\n시간이 소요될 수 있습니다.')) {
    $('#code').hide()
    $('#spinner').show();

    // const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    function a() {
      return new Promise(resolve => {
        $('#remark').text('')
        switch (useApp) {
          case 'discord':
            getDiscordCode()
            break
          case 'web':
            getWebCode()
            break
          case 'helloworld':
            _getCode("helloworld", { language: useLanguage })
            break
        }
        resolve(true)
      })
    }
    a().then(() => {
      $('#spinner').hide()
      $('#code').show()
    })
  }
}

function addKeyValueInput(message) {
  let value
  while (true) {
    const uid = new ShortUniqueId();
    value = uid() + uid() + uid() + uid() + uid() + uid() + uid() + uid() + String(new Date().getMilliseconds())
    if (document.getElementById("input-" + value) === null) break
  }

  $("#keys-values").append(`<div id="input-${value}" class="input-group">
              <div class="input-group-prepend">
                <span id="key-value" class="input-group-text"
                  >${message}</span
                >
                <span class="input-group-text" onclick="deleteKeyValueInput('${value}')"
                  >삭제</span
                >
              </div>
              <input type="text" class="form-control first" />
              <input type="text" class="form-control second" />
            </div>`)

}

function deleteKeyValueInput(key) {
  $("#input-" + key).remove()
}

function initCommand() {
  switch (useApp) {
    case 'discord':
      $("#command").html(`<div id="inputs">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="prefix-input"
                >접두사 입력</span
              >
            </div>
            <input
              type="text"
              class="form-control"
              aria-describedby="prefix-input"
            />
          </div>

          <div id="keys-values"></div>
        </div>

        <br />

        <button onclick="addKeyValueInput('명령어, 대답')">명령어, 대답 추가하기</button>`)
      break
    case 'web':
      $("#command").html(`<div id="inputs">
          <div id="keys-values"></div>
        </div>

        <br />

        <button onclick="addKeyValueInput('웹 경로(path) (슬러시 (/)포함 입력), 출력값')">웹 경로, 출력값 추가하기</button>`)
      break
    default:
      $('#command').html('')
      break
  }

  $('#language-selector').empty()
  const app = apps[useApp]
  for (let i = 0; i < app.length; i++)
    $('#language-selector').append(`<option value="${langs[app[i]]}">${app[i]}</option>`)
  $('#language-selector').html()
}
initCommand()
