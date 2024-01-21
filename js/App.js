window.CONTRACT = {
  address: '0x995B8b7Fe4C397df58765D08F86FD32Dfb9B4F63',
  network: 'https://rpc-mumbai.maticvigil.com',
  explore: 'https://mumbai.polygonscan.com',
  abi: [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_add",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_info",
          "type": "string"
        }
      ],
      "name": "add_Exporter",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "hash",
          "type": "bytes32"
        },
        {
          "internalType": "string",
          "name": "_ipfs",
          "type": "string"
        }
      ],
      "name": "addDocHash",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_add",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_newInfo",
          "type": "string"
        }
      ],
      "name": "alter_Exporter",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_exporter",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "_ipfsHash",
          "type": "string"
        }
      ],
      "name": "addHash",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_newOwner",
          "type": "address"
        }
      ],
      "name": "changeOwner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_add",
          "type": "address"
        }
      ],
      "name": "delete_Exporter",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_hash",
          "type": "bytes32"
        }
      ],
      "name": "deleteHash",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "count_Exporters",
      "outputs": [
        {
          "internalType": "uint16",
          "name": "",
          "type": "uint16"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "count_hashes",
      "outputs": [
        {
          "internalType": "uint16",
          "name": "",
          "type": "uint16"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_hash",
          "type": "bytes32"
        }
      ],
      "name": "findDocHash",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_add",
          "type": "address"
        }
      ],
      "name": "getExporterInfo",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
}
async function connect() {
  if (window.ethereum) {
    try {
      const selectedAccount = await window.ethereum
        .request({
          method: 'eth_requestAccounts',
        })
        .then((accounts) => {
          return accounts[0]
        })
        .catch(() => {
          throw Error('No account selected 👍')
        })

      window.userAddress = selectedAccount
      console.log(selectedAccount)
      window.localStorage.setItem('userAddress', window.userAddress)
      window.location.reload()
    } catch (error) { }
  } else {
    $('#upload_file_button').attr('disabled', true)
    $('#doc-file').attr('disabled', true)
    // Show The Warning for not detecting wallet
    document.querySelector('.alert').classList.remove('d-none')
  }
}

window.onload = async () => {
  $('#loader').hide()

  $('#loginButton').hide()
  $('#recent-header').hide()
  $('.loader-wraper').fadeOut('slow')
  hide_txInfo()
  $('#upload_file_button').attr('disabled', true)

  window.userAddress = window.localStorage.getItem('userAddress')

  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum)
    window.contract = new window.web3.eth.Contract(
      window.CONTRACT.abi,
      window.CONTRACT.address,
    )
    if (window.userAddress.length > 10) {
      // let isLocked =await window.ethereum._metamask.isUnlocked();
      //  if(!isLocked) disconnect();
      $('#logoutButton').show()
      $('#loginButton').hide()
      $('#userAddress')
        .html(`<i class="fa-solid fa-address-card mx-2 text-primary"></i>${truncateAddress(
          window.userAddress,
        )}
       <a class="text-info" href="${window.CONTRACT.explore}/address/${window.userAddress
          }" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-square-arrow-up-right text-warning"></i></a>  
       </a>`)

      if (window.location.pathname == '/admin.html') await getCounters()

      await getExporterInfo()
      await get_ChainID()
      await get_ethBalance()
      $('#Exporter-info').html(
        `<i class="fa-solid fa-building-columns mx-2 text-warning"></i>${window.info}`,
      )

      setTimeout(() => {
        listen()
      }, 0)
    } else {
      $('#logoutButton').hide()
      $('#loginButton').show()
      $('#upload_file_button').attr('disabled', true)
      $('#doc-file').attr('disabled', true)
      $('.box').addClass('d-none')
      $('.loading-tx').addClass('d-none')
    }
  } else {
    //No metamask detected
    $('#logoutButton').hide()
    $('#loginButton').hide()
    $('.box').addClass('d-none')
    $('#upload_file_button').attr('disabled', true)
    $('#doc-file').attr('disabled', true)
    document.querySelector('.alert').classList.remove('d-none')

    // alert("Please download metamask extension first.\nhttps://metamask.io/download/");
    // window.location = "https://metamask.io/download/"
  }
}

function hide_txInfo() {
  $('.transaction-status').addClass('d-none')
}

function show_txInfo() {
  $('.transaction-status').removeClass('d-none')
}
async function get_ethBalance() {
  await web3.eth.getBalance(window.userAddress, function (err, balance) {
    if (err === null) {
      $('#userBalance').html(
        "<i class='fa-brands fa-gg-circle mx-2 text-danger'></i>" +
        web3.utils.fromWei(balance).substr(0, 6) +
        '',
      )
    } else $('#userBalance').html('n/a')
  })
}

if (window.ethereum) {
  window.ethereum.on('accountsChanged', function (accounts) {
    connect()
  })
}

function printUploadInfo(result) {
  $('#transaction-hash').html(
    `<a target="_blank" title="View Transaction at Polygon Scan" href="${window.CONTRACT.explore}/tx/` +
    result.transactionHash +
    '"+><i class="fa fa-check-circle font-size-2 mx-1 text-white mx-1"></i></a>' +
    truncateAddress(result.transactionHash),
  )
  $('#file-hash').html(
    `<i class="fa-solid fa-hashtag mx-1"></i> ${truncateAddress(
      window.hashedfile,
    )}`,
  )
  $('#contract-address').html(
    `<i class="fa-solid fa-file-contract mx-1"></i> ${truncateAddress(
      result.to,
    )}`,
  )
  $('#time-stamps').html('<i class="fa-solid fa-clock mx-1"></i>' + getTime())
  $('#blockNumber').html(
    `<i class="fa-solid fa-link mx-1"></i>${result.blockNumber}`,
  )
  $('#blockHash').html(
    `<i class="fa-solid fa-shield mx-1"></i> ${truncateAddress(
      result.blockHash,
    )}`,
  )
  $('#to-netowrk').html(
    `<i class="fa-solid fa-chart-network"></i> ${window.chainID}`,
  )
  $('#to-netowrk').hide()
  $('#gas-used').html(
    `<i class="fa-solid fa-gas-pump mx-1"></i> ${result.gasUsed} Gwei`,
  )
  $('#loader').addClass('d-none')
  $('#upload_file_button').addClass('d-block')
  show_txInfo()
  get_ethBalance()

  $('#note').html(`<h5 class="text-info">
   Transaction Confirmed to the BlockChain 😊<i class="mx-2 text-info fa fa-check-circle" aria-hidden="true"></i>
   </h5>`)
  listen()
}

async function sendHash() {
  $('#loader').removeClass('d-none')
  $('#upload_file_button').slideUp()
  $('#note').html(
    `<h5 class="text-info">Please confirm the transaction 🙂</h5>`,
  )
  $('#upload_file_button').attr('disabled', true)
  get_ChainID()
  // Initilize Ipfs

  const file = document.getElementById('doc-file').files[0]
  node = await Ipfs.create({ repo: 'Ali-ok' + Math.random() })
  const fileReader = new FileReader()
  fileReader.readAsArrayBuffer(file)
  fileReader.onload = async (event) => {
    let result = await node.add(fileReader.result)
    window.ipfsCid = result.path
    MyCID = window.ipfsCid + '/'
    console.log('My-CID 1: ' + MyCID)
  }

  // =================================================
  if (window.hashedfile) {
    const file = document.getElementById('doc-file').files[0]
    node = await Ipfs.create({ repo: 'Ali-ok' + Math.random() })
    const fileReader = new FileReader()
    fileReader.readAsArrayBuffer(file)
    fileReader.onload = async (event) => {
      let result = await node.add(fileReader.result)
      window.ipfsCid = result.path
    }
    await window.contract.methods
      .addDocHash(window.hashedfile, window.ipfsCid)
      .send({ from: window.userAddress })
      .on('transactionHash', function (_hash) {
        $('#note').html(
          `<h5 class="text-info p-1 text-center">Please wait for transaction to be mined...</h5>`,
        )
      })

      .on('receipt', function (receipt) {
        printUploadInfo(receipt)
        generateQRCode()
      })

      .on('confirmation', function (confirmationNr) { })
      .on('error', function (error) {
        console.log(error.message)
        $('#note').html(`<h5 class="text-center">${error.message} 😏</h5>`)
        $('#loader').addClass('d-none')
        $('#upload_file_button').slideDown()
      })
  }
}

async function deleteHash() {
  $('#loader').removeClass('d-none')
  $('#upload_file_button').slideUp()
  $('#note').html(
    `<h5 class="text-info">Please confirm the transaction 🙂</h5>`,
  )
  $('#upload_file_button').attr('disabled', true)
  get_ChainID()

  if (window.hashedfile) {
    await window.contract.methods
      .deleteHash(window.hashedfile)
      .send({ from: window.userAddress })
      .on('transactionHash', function (hash) {
        $('#note').html(
          `<h5 class="text-info p-1 text-center">Please wait for transaction to be mined 😴</h5>`,
        )
      })

      .on('receipt', function (receipt) {
        $('#note').html(
          `<h5 class="text-info p-1 text-center">Document Deleted 😳</h5>`,
        )

        $('#loader').addClass('d-none')
        $('#upload_file_button').slideDown()
      })

      .on('confirmation', function (confirmationNr) {
        console.log(confirmationNr)
      })
      .on('error', function (error) {
        console.log(error.message)
        $('#note').html(`<h5 class="text-center">${error.message}</h5>`)
        $('#loader').addClass('d-none')
        $('#upload_file_button').slideDown()
      })
  }
}

function getTime() {
  let d = new Date()
  a =
    d.getFullYear() +
    '-' +
    (d.getMonth() + 1) +
    '-' +
    d.getDate() +
    ' - ' +
    d.getHours() +
    ':' +
    d.getMinutes() +
    ':' +
    d.getSeconds()
  return a
}

async function get_ChainID() {
  let a = await web3.eth.getChainId()
  console.log(a)
  switch (a) {
    case 1:
      window.chainID = 'Ethereum Main Network (Mainnet)'
      break
    case 80001:
      window.chainID = 'Polygon Test Network'
      break
    case 137:
      window.chainID = 'Polygon Mainnet'
      break
    case 3:
      window.chainID = 'Ropsten Test Network'
      break
    case 4:
      window.chainID = 'Rinkeby Test Network'
      break
    case 5:
      window.chainID = 'Goerli Test Network'
      break
    case 42:
      window.chainID = 'Kovan Test Network'
      break
    default:
      window.chainID = 'Uknnown ChainID'
      break
  }
  let network = document.getElementById('network')
  if (network) {
    document.getElementById(
      'network',
    ).innerHTML = `<i class="text-info fa-solid fa-circle-nodes mx-2"></i>${window.chainID}`
  }
}

function get_Sha3() {
  hide_txInfo()
  $('#note').html(`<h5 class="text-warning">Hashing Your Document 😴...</h5>`)

  $('#upload_file_button').attr('disabled', false)

  console.log('file changed')

  var file = document.getElementById('doc-file').files[0]
  if (file) {
    var reader = new FileReader()
    reader.readAsText(file, 'UTF-8')
    reader.onload = function (evt) {
      // var SHA256 = new Hashes.SHA256();
      // = SHA256.hex(evt.target.result);
      window.hashedfile = web3.utils.soliditySha3(evt.target.result)
      console.log(`Document Hash : ${window.hashedfile}`)
      $('#note').html(
        `<h5 class="text-center text-info">Document Hashed  😎 </h5>`,
      )
    }
    reader.onerror = function (evt) {
      console.log('error reading file')
    }
  } else {
    window.hashedfile = null
  }
}

function disconnect() {
  $('#logoutButton').hide()
  $('#loginButton').show()
  window.userAddress = null
  $('.wallet-status').addClass('d-none')
  window.localStorage.setItem('userAddress', null)
  $('#upload_file_button').addClass('disabled')
}

function truncateAddress(address) {
  if (!address) {
    return
  }
  return `${address.substr(0, 7)}...${address.substr(
    address.length - 8,
    address.length,
  )}`
}

async function addExporter() {
  const address = document.getElementById('Exporter-address').value
  const info = document.getElementById('info').value

  if (info && address) {
    $('#loader').removeClass('d-none')
    $('#ExporterBtn').slideUp()
    $('#edit').slideUp()
    $('#delete').slideUp()
    $('#note').html(
      `<h5 class="text-info">Please confirm the transaction 👍...</h5>`,
    )
    $('#ExporterBtn').attr('disabled', true)
    $('#delete').attr('disabled', true)
    $('#edit').attr('disabled', true)
    get_ChainID()

    try {
      await window.contract.methods
        .add_Exporter(address, info)
        .send({ from: window.userAddress })

        .on('transactionHash', function (hash) {
          $('#note').html(
            `<h5 class="text-info p-1 text-center">Please wait for transaction to be mined 😴...</h5>`,
          )
        })

        .on('receipt', function (receipt) {
          $('#loader').addClass('d-none')
          $('#ExporterBtn').slideDown()
          $('#edit').slideDown()
          $('#delete').slideDown()
          console.log(receipt)
          $('#note').html(
            `<h5 class="text-info">Exporter Added to the Blockchain 😇</h5>`,
          )
        })

        .on('confirmation', function (confirmationNr) { })
        .on('error', function (error) {
          console.log(error.message)
          $('#note').html(`<h5 class="text-center">${error.message}</h5>`)
          $('#loader').addClass('d-none')
          $('#ExporterBtn').slideDown()
        })
    } catch (error) {
      $('#note').html(`<h5 class="text-center">${error.message}</h5>`)
      $('#loader').addClass('d-none')
      $('#ExporterBtn').slideDown()
      $('#edit').slideDown()
      $('#delete').slideDown()
    }
  } else {
    $('#note').html(
      `<h5 class="text-center text-warning">You need to provide address & inforamtion to add  </h5>`,
    )
  }
}

async function getExporterInfo() {
  await window.contract.methods
    .getExporterInfo(window.userAddress)
    .call({ from: window.userAddress })

    .then((result) => {
      window.info = result
    })
}

async function getCounters() {
  await window.contract.methods
    .count_Exporters()
    .call({ from: window.userAddress })

    .then((result) => {
      $('#num-exporters').html(
        `<i class="fa-solid fa-building-columns mx-2 text-info"></i>${result}`,
      )
    })
  await window.contract.methods
    .count_hashes()
    .call({ from: window.userAddress })

    .then((result) => {
      $('#num-hashes').html(
        `<i class="fa-solid fa-file mx-2 text-warning"></i>${result}`,
      )
    })
}

async function editExporter() {
  const address = document.getElementById('Exporter-address').value
  const info = document.getElementById('info').value

  if (info && address) {
    $('#loader').removeClass('d-none')
    $('#ExporterBtn').slideUp()
    $('#edit').slideUp()
    $('#delete').slideUp()
    $('#note').html(
      `<h5 class="text-info">Please confirm the transaction 😴...</h5>`,
    )
    $('#ExporterBtn').attr('disabled', true)
    get_ChainID()

    try {
      await window.contract.methods
        .alter_Exporter(address, info)
        .send({ from: window.userAddress })

        .on('transactionHash', function (hash) {
          $('#note').html(
            `<h5 class="text-info p-1 text-center">Please wait for transaction to be mined 😇...</h5>`,
          )
        })

        .on('receipt', function (receipt) {
          $('#loader').addClass('d-none')
          $('#ExporterBtn').slideDown()
          console.log(receipt)
          $('#note').html(
            `<h5 class="text-info">Exporter Updated Successfully 😊</h5>`,
          )
        })

        .on('confirmation', function (confirmationNr) { })
        .on('error', function (error) {
          console.log(error.message)
          $('#note').html(`<h5 class="text-center">${error.message} 👍</h5>`)
          $('#loader').addClass('d-none')
          $('#ExporterBtn').slideDown()
        })
    } catch (error) {
      $('#note').html(`<h5 class="text-center">${error.message} 👍</h5>`)
      $('#loader').addClass('d-none')
      $('#ExporterBtn').slideDown()
      $('#edit').slideDown()
      $('#delete').slideDown()
    }
  } else {
    $('#note').html(
      `<h5 class="text-center text-warning">You need to provide address & inforamtion to update 😵‍💫 </h5>`,
    )
  }
}

async function deleteExporter() {
  const address = document.getElementById('Exporter-address').value

  if (address) {
    $('#loader').removeClass('d-none')
    $('#ExporterBtn').slideUp()
    $('#edit').slideUp()
    $('#delete').slideUp()
    $('#note').html(
      `<h5 class="text-info">Please confirm the transaction 😕...</h5>`,
    )
    $('#ExporterBtn').attr('disabled', true)
    get_ChainID()

    try {
      await window.contract.methods
        .delete_Exporter(address)
        .send({ from: window.userAddress })

        .on('transactionHash', function (hash) {
          $('#note').html(
            `<h5 class="text-info p-1 text-center">Please wait for transaction to be mined 😴 ...</h5>`,
          )
        })

        .on('receipt', function (receipt) {
          $('#loader').addClass('d-none')
          $('#ExporterBtn').slideDown()
          $('#edit').slideDown()
          $('#delete').slideDown()
          console.log(receipt)
          $('#note').html(
            `<h5 class="text-info">Exporter Deleted Successfully 🙂</h5>`,
          )
        })
        .on('error', function (error) {
          console.log(error.message)
          $('#note').html(`<h5 class="text-center">${error.message} 🙂</h5>`)
          $('#loader').addClass('d-none')
          $('#ExporterBtn').slideDown()
          $('#edit').slideDown()
          $('#delete').slideDown()
        })
    } catch (error) {
      $('#note').html(`<h5 class="text-center">${error.message} 🙂</h5>`)
      $('#loader').addClass('d-none')
      $('#ExporterBtn').slideDown()
      $('#edit').slideDown()
      $('#delete').slideDown()
    }
  } else {
    $('#note').html(
      `<h5 class="text-center text-warning">You need to provide address to delete 👍</h5>`,
    )
  }
}

function generateQRCode() {
  document.getElementById('qrcode').innerHTML = ''
  console.log('making qr-code...')
  var qrcode = new QRCode(document.getElementById('qrcode'), {
    colorDark: '#000',
    colorLight: '#fff',
    correctLevel: QRCode.CorrectLevel.H,
  })
  if (!window.hashedfile) return
  let url = `${window.location.host}/verify.html?hash=${window.hashedfile}`
  qrcode.makeCode(url)
  document.getElementById('download-link').download = document.getElementById(
    'doc-file',
  ).files[0].name
  document.getElementById('verfiy').href = window.location.protocol + '//' + url

  function makeDownload() {
    document.getElementById('download-link').href = document.querySelector(
      '#qrcode img',
    ).src
  }
  setTimeout(makeDownload, 500)
  //  makeDownload();
}

async function listen() {
  console.log('started...')
  if (window.location.pathname != '/upload.html') return
  document.querySelector('.loading-tx').classList.remove('d-none')
  window.web3 = new Web3(window.ethereum)
  window.contract = new window.web3.eth.Contract(
    window.CONTRACT.abi,
    window.CONTRACT.address,
  )
  await window.contract.getPastEvents(
    'addHash',
    {
      filter: {
        _exporter: window.userAddress, //Only get the documents uploaded by current Exporter
      },
      fromBlock: (await window.web3.eth.getBlockNumber()) - 999,
      toBlock: 'latest',
    },
    function (error, events) {
      printTransactions(events)
      console.log(events)
    },
  )
}

function printTransactions(data) {
  document.querySelector('.transactions').innerHTML = ''
  document.querySelector('.loading-tx').classList.add('d-none')
  if (!data.length) {
    $('#recent-header').hide()
    return
  }
  $('#recent-header').show()
  const main = document.querySelector('.transactions')
  for (let i = 0; i < data.length; i++) {
    const a = document.createElement('a')
    a.href = `${window.CONTRACT.explore}` + '/tx/' + data[i].transactionHash
    a.setAttribute('target', '_blank')
    a.className =
      'col-lg-3 col-md-4 col-sm-5 m-2  bg-dark text-light rounded position-relative card'
    a.style = 'overflow:hidden;'
    const image = document.createElement('object')
    image.style = 'width:100%;height: 100%;'
    image.data = `https://ipfs.io/ipfs/${data[i].returnValues[1]}`
    const num = document.createElement('h1')
    num.append(document.createTextNode(i + 1))
    a.appendChild(image)
    num.style =
      'position:absolute; left:4px; bottom: -20px;font-size:4rem; color: rgba(20, 63, 74, 0.35);'
    a.appendChild(num)
    main.prepend(a)
  }
}


document.addEventListener("DOMContentLoaded", function () {
  // Get references to the download button and file input
  const downloadButton = document.getElementById("downloadbutton");
  const fileInput = document.getElementById("doc-file");

  // Add a click event listener to the download button
  // downloadButton.addEventListener("click", function () {
  //   // Trigger a click event on the file input
  //   fileInput.click();
  // });

  // Function to handle file input change (you may already have this function)
  // function get_Sha3() {
 
  //   // ...
  // }
  // function sendHash() {
  //   // Your code to upload the certificate goes here
  //   // ...
  // }
});


//  Initializing variables
// var defaultCertPNG = "../cretificate/certificates/dummy.png";
// var defaultFontSize = 20;
// var defaultFont = "Arial";
// var defaultColor = "black";
// var prevX = 0;
// var prevY = 0;

// // Defining Canvas
// var canvas = document.getElementById("certificatecanvas");
// var ctx = canvas.getContext("2d");
// var certImage = new Image();

// var canvasOffset = canvas.getBoundingClientRect();
// var offsetX = canvasOffset.left;
// var offsetY = canvasOffset.top;
// var scrollX = window.pageXOffset;
// var scrollY = window.pageYOffset;
// var startX = 0;
// var startY = 0;
// var selectedElement = null;
// var dragMode = false;

// // Defining Sheet Stuffs
// var titles = null;
// var sheetData = null;
// var progress = document.getElementById("progress");
// var loaderbody = document.querySelector(".loaderbody");

// // Defining DOM Elements
// var Inputs = document.getElementById("inputs");
// var downloadTypeButton = document.getElementById("downloadtype");
// var downloadButton = document.getElementById("downloadbutton");
// var downloadZipButton = document.getElementById("downloadzipbutton");
// var imageFileInput = document.getElementById("uploadimage");
// var addInputButton = document.getElementById("addinput");
// var Editor = {
//   font: document.getElementById("fontfamily"),
//   fontsize: document.getElementById("fontsize"),
//   textalign: document.getElementById("textalign"),
//   color: document.getElementById("textcolor"),
//   bold: document.getElementById("textbold"),
//   italic: document.getElementById("textitalic"),
//   opacity: document.getElementById("textopacity")
// };

// // On Document Load
// document.addEventListener("DOMContentLoaded", function () {
//   // Creating Image from PNG file
//   certImage.src = defaultCertPNG;
//   var dimentionRatio = certImage.width / certImage.height;

//   // When Image Loads Successfully
//   certImage.onload = function () {
//     // Setting Canvas Size
//     canvas.width = certImage.width;
//     canvas.height = certImage.height;
//     defaultFontSize = canvas.width / 100;
//     console.log(defaultFontSize);
//     drawTextfromInputs();
//     addListenerToInputs();
//   };
// });

// function addListenerToInputs() {
//   var inputs = document.getElementsByClassName("certinputs");
//   var inputsLength = inputs.length;
//   for (var i = 0; i < inputsLength; i++) {
//     inputs[i].addEventListener("keyup", function () {
//       drawTextfromInputs();
//     });
//   }

//   var delbuttons = document.getElementsByClassName("delbutton");
//   for (var i = 0; i < delbuttons.length; i++) {
//     delbuttons[i].addEventListener("click", function () {
//       var parent = this.parentNode;
//       parent.remove();
//       drawTextfromInputs();
//     });
//   }

//   var checkboxes = document.getElementsByClassName("certcheck");
//   for (var i = 0; i < checkboxes.length; i++) {
//     checkboxes[i].addEventListener("change", function () {
//       updateEditorOptions();
//     });
//   }
// }

// function updateEditorOptions() {
//   var checkedCheckboxes = Inputs.querySelectorAll("input:checked");

//   if (checkedCheckboxes.length === 1) {
//     var selectionData =
//       checkedCheckboxes[0].parentNode.querySelector(".certinputs").dataset;
//     selectedElement =
//       checkedCheckboxes[0].parentNode.querySelector(".certinputs");
//     Editor.font.value = selectionData.font;
//     Editor.fontsize.value = selectionData.fontsize;
//     Editor.textalign.value = selectionData.textalign;
//     Editor.color.value = selectionData.color;
//     Editor.bold.dataset.active = selectionData.bold;
//     Editor.italic.dataset.active = selectionData.italic;
//     Editor.opacity.value = selectionData.opacity;
//   } else {
//     // Do Nothing
//     selectedElement = null;
//   }
//   drawTextfromInputs();
// }

// function drawTextfromInputs() {
//   // Clearing Canvas with white background
//   ctx.fillStyle = "white";
//   ctx.fillRect(0, 0, canvas.width, canvas.height);
//   ctx.fillStyle = "black";

//   ctx.drawImage(certImage, 0, 0, canvas.width, canvas.height);

//   // Getting Inputs
//   var textInputs = document.getElementsByClassName("certinputs");
//   var textInputsLength = textInputs.length;

//   // Looping through Inputs
//   for (var i = 0; i < textInputsLength; i++) {
//     // Getting Input
//     var textInput = textInputs[i];

//     // Getting Input Values
//     var text = textInput.value;
//     var position = [textInput.dataset.x, textInput.dataset.y];
//     var fontSize = textInput.dataset.fontsize;
//     var font = textInput.dataset.font;
//     var textAlign = textInput.dataset.textalign;
//     var opacity = textInput.dataset.opacity;
//     var color = textInput.dataset.color;
//     var bold = textInput.dataset.bold;
//     var italic = textInput.dataset.italic;
//     var editable = textInput.dataset.editable;

//     // Adding Text
//     addText(
//       ctx,
//       text,
//       position,
//       fontSize,
//       font,
//       textAlign,
//       opacity,
//       color,
//       bold,
//       italic,
//       textInputs[i],
//       editable
//     );
//   }
//   if (selectedElement != null) {
//     drawBorderForSelected();
//   }
// }

// function drawBorderForSelected() {
//   // Create Rectange over Selected Element
//   ctx.strokeStyle = "#0B082F";
//   ctx.lineWidth = 8;
//   var x = selectedElement.dataset.x;
//   var y = selectedElement.dataset.y;
//   var width = selectedElement.dataset.width;
//   var height = selectedElement.dataset.height;
//   var fontSize = selectedElement.dataset.fontsize;
//   var sW = canvas.width / 100;
//   var sH = canvas.height / 100;
//   if (selectedElement.dataset.textalign == "center") {
//     x = x - width / 2;
//   } else if (selectedElement.dataset.textalign == "right") {
//     x = x - width;
//   }

//   var x1 = (x - 1) * sW;
//   var y1 = (y - 2) * sH;
//   var x2 = (Number(width) + 2) * sW;
//   var y2 = (Number(height) + 4) * sH;
//   ctx.strokeRect(x1, y1, x2, y2);

//   ctx.fillStyle = "white";
//   drawCircle(x1, y1);
//   drawCircle(x1 + x2, y1);
//   drawCircle(x1, y1 + y2);
//   drawCircle(x1 + x2, y1 + y2);

//   function drawCircle(x, y, r = 15) {
//     ctx.beginPath();
//     ctx.arc(x, y, r, 0, Math.PI * 2, false);
//     ctx.fill();
//     ctx.stroke();
//   }

//   console.log(sW, sH, defaultFontSize, width);
// }

// function addText(
//   ctx = ctx,
//   text = "Default Text",
//   position = [0, 0],
//   fontSize = 5 * defaultFontSize,
//   font = defaultFont,
//   textAlign = "center",
//   opacity = 1,
//   color = defaultColor,
//   bold = false,
//   italic = false,
//   dom,
//   editable = "1"
// ) {
//   // Setting Font
//   ctx.font =
//     (Number(bold) ? "bold " : "") +
//     (Number(italic) ? "italic " : "") +
//     Number(fontSize) * defaultFontSize +
//     "px " +
//     font;

//   // Set color
//   ctx.fillStyle = color;

//   // Setting Opacity
//   ctx.globalAlpha = Number(opacity) / 100;

//   // Setting Text Alignment
//   ctx.textAlign = textAlign;

//   // Setting Text Position
//   ctx.textBaseline = "top";
//   if (editable == "0") {
//     text = "{{" + text + "}}";
//   }

//   // Measure Height & Width of Text
//   var textWidth = ctx.measureText(text).width * (100 / canvas.width);
//   var textHeight = fontSize;
//   dom.dataset.width = textWidth;
//   dom.dataset.height = textHeight;
//   // console.log(textWidth,textHeight);

//   // Setting Text Position
//   const xPos = Number(position[0] * (canvas.width / 100));
//   const yPos = Number(position[1] * (canvas.height / 100));

//   ctx.fillText(text, xPos, yPos);
// }

// downloadButton.addEventListener("click", async function () {
//   selectedElement = null;
//   drawTextfromInputs();

//   // Getting the Download Type
//   var downloadType = downloadTypeButton.value;
//   testFun(downloadType);

//   if (downloadType == "png" || downloadType == "jpg") {
//     // Creating Image from Canvas
//     var image = canvas.toDataURL("image/" + downloadType);

//     // Creating Download Link
//     var link = document.createElement("a");
//     link.download = "certificate." + downloadType;
//     link.href = image;
//     await testFun(image);
//     link.click();
//   } else if (downloadType == "pdf") {
//     var pdf = new jsPDF();
//     pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0);
//     pdf.save("certificate.pdf");
//   }
// });

// imageFileInput.addEventListener("change", function () {
//   var file = imageFileInput.files[0];
//   var reader = new FileReader();
//   reader.onloadend = function () {
//     certImage.src = reader.result;
//   };
//   if (file) {
//     reader.readAsDataURL(file);
//   } else {
//     certImage.src = defaultCertPNG;
//   }
// });

// addInputButton.addEventListener("click", function () {
//   addField();
// });

// function addField(text = "Field Name", position = [20, 20], editable = true) {
//   var data = `
//  <div>
//  <input type="checkbox"  class="certcheck" />
//  <input
//    type="text"
//    value="${text}"
//    data-fontsize="5"
//    data-font="'Open Sans', sans-serif"
//    data-textalign="left"
//    data-x="${position[0]}"
//    data-y="${position[1]}"
//    data-color="#000"
//    data-opacity="80"
//    class="certinputs"
//    data-bold="0"
//    data-italic="0"
//    data-editable="${editable ? "1" : "0"}"
//    ${editable ? "" : "disabled"}
//  />
//  <button class="delbutton"><i class="fa fa-trash"></i></button>
// </div>
//  `;
//   Inputs.innerHTML += data;
//   addListenerToInputs();
//   drawTextfromInputs();
// }

// Editor.fontsize.addEventListener("change", function () {
//   updateDataset("fontsize", this.value);
// });

// Editor.textalign.addEventListener("change", function () {
//   updateDataset("textalign", this.value);
// });

// Editor.color.addEventListener("input", function () {
//   updateDataset("color", this.value);
// });

// Editor.font.addEventListener("change", function () {
//   updateDataset("font", this.value);
// });

// Editor.bold.addEventListener("click", function () {
//   this.dataset.active = Number(this.dataset.active) ? 0 : 1;
//   updateDataset("bold", this.dataset.active);
// });

// Editor.italic.addEventListener("click", function () {
//   this.dataset.active = Number(this.dataset.active) ? 0 : 1;
//   updateDataset("italic", this.dataset.active);
// });

// Editor.opacity.addEventListener("input", function () {
//   updateDataset("opacity", this.value);
// });

// function updateDataset(dataname, value, mode = "w") {
//   // alert("Color Changed");
//   var checkedCheckboxes = document
//     .getElementById("inputs")
//     .querySelectorAll("input:checked");
//   for (var i = 0; i < checkedCheckboxes.length; i++) {
//     if (mode == "a") {
//       checkedCheckboxes[i].parentNode.querySelector(".certinputs").dataset[
//         dataname
//       ] =
//         Number(
//           checkedCheckboxes[i].parentNode.querySelector(".certinputs").dataset[
//           dataname
//           ]
//         ) + Number(value);
//     } else {
//       checkedCheckboxes[i].parentNode.querySelector(".certinputs").dataset[
//         dataname
//       ] = value;
//     }
//   }
//   drawTextfromInputs();
// }

// let myStick = new JoystickController("stick", 64, 8);
// function loop() {
//   requestAnimationFrame(loop);
//   // Get current values
//   let x = myStick.value.x;
//   let y = myStick.value.y;
//   if (!(x == 0 && y == 0)) {
//     if (Math.abs(x - prevX) > 0.1) {
//       prevX = x;
//       updateDataset("x", x * 10, "a");
//     }
//     if (Math.abs(y - prevY) > 0.1) {
//       prevY = y;
//       updateDataset("y", y * 10, "a");
//     }
//   }
// }
// loop();
// //  On Window Resize event
// window.addEventListener("resize", function () {
//   canvasOffset = canvas.getBoundingClientRect();
//   offsetX = canvasOffset.left;
//   offsetY = canvasOffset.top;
// });

// // test if x,y is inside the bounding box of texts[textIndex]
// function textHittest(x, y, dom) {
//   // console.log(canvasOffset.height);
//   var data = dom.dataset;
//   var posX = Number(data.x);
//   var posY = Number(data.y);
//   var width = Number(data.width);
//   var height = Number(data.height);

//   var yCheck = y >= posY && y <= posY + height;
//   if (data.textalign == "center") {
//     var xCheck = x >= posX - width / 2 && x <= posX + width / 2;
//   } else if (data.textalign == "right") {
//     var xCheck = x >= posX - width && x <= posX;
//   } else {
//     var xCheck = x >= posX && x <= posX + width;
//   }

//   if (xCheck && yCheck) {
//     return true;
//   } else {
//     return false;
//   }
// }

// function handleMouseDown(e) {
//   e.preventDefault();
//   startX = parseInt(e.clientX - offsetX);
//   startY = parseInt(e.clientY - offsetY);

//   // Mapped x and y between 0-100
//   startX = (startX / canvasOffset.width) * 100;
//   startY = (startY / canvas.getBoundingClientRect().height) * 100;

//   var certInputs = Inputs.getElementsByClassName("certinputs");
//   for (var i = 0; i < certInputs.length; i++) {
//     // console.log(certInputs[i]);

//     if (textHittest(startX, startY, certInputs[i])) {
//       // change Cursor to Pointer
//       canvas.style.cursor = "pointer";
//       selectedElement = certInputs[i];
//     }
//   }
// }

// // done dragging
// function handleMouseUp(e) {
//   e.preventDefault();
//   selectedElement = null;
//   canvas.style.cursor = "default";
//   drawTextfromInputs();
//   // console.log("mouse up");
// }

// // also done dragging
// function handleMouseOut(e) {
//   e.preventDefault();
//   selectedElement = null;
//   canvas.style.cursor = "default";
//   drawTextfromInputs();
//   // console.log("mouse out");
// }

// function handleMouseMove(e) {
//   if (!selectedElement) {
//     return;
//   }
//   e.preventDefault();
//   mouseX = parseInt(e.clientX - offsetX);
//   mouseY = parseInt(e.clientY - offsetY);

//   mouseX = (mouseX / canvasOffset.width) * 100;
//   mouseY = (mouseY / canvas.getBoundingClientRect().height) * 100;
//   // Put your mousemove stuff here
//   var dx = mouseX - startX;
//   var dy = mouseY - startY;
//   // console.log(dx, dy);
//   startX = mouseX;
//   startY = mouseY;
//   selectedElement.dataset.x = Number(selectedElement.dataset.x) + dx;
//   selectedElement.dataset.y = Number(selectedElement.dataset.y) + dy;
//   drawTextfromInputs();
//   // console.log("mouse move");
// }

// // listen for mouse events
// canvas.addEventListener("mousedown", function (e) {
//   dragMode = true;
//   handleMouseDown(e);
// });
// canvas.addEventListener("mousemove", function (e) {
//   if (dragMode) {
//     handleMouseMove(e);
//   }
// });
// canvas.addEventListener("mouseup", function (e) {
//   dragMode = false;
//   handleMouseUp(e);
// });
// canvas.addEventListener("mouseout", function (e) {
//   if (dragMode) {
//     handleMouseOut(e);
//     dragMode = false;
//   }
// });

// // ----------------------------------------------
// // ------------  CSV/Excel Upload  --------------
// // ----------------------------------------------

// var file = document.getElementById("uploadcsv");
// var viewer = document.getElementById("dataviewer");
// file.addEventListener("change", importFile);

// function importFile(evt) {
//   var f = evt.target.files[0];

//   if (f) {
//     var r = new FileReader();
//     r.onload = (e) => {
//       var contents = JSON.parse(processExcel(e.target.result));
//       // Get First object from object Contents
//       var data = Object.values(contents)[0];
//       titles = data[0];
//       sheetData = data.slice(1);
//       console.log(sheetData);

//       Inputs.innerHTML = "";
//       document.querySelector(".downloadzip").style.display = "flex";
//       // document.querySelector(".downloadzip").href = "data:text/csv;charset=utf-8," + encodeURIComponent(data.map(row => titles.map(field => row[field]).join(",")).join("\n"));
//       document.querySelector(".downloadfile").style.display = "none";
//       titles.forEach((title, i) => {
//         addField(title, [20, 20 + i * 10], false);
//       });
//     };
//     r.readAsBinaryString(f);
//   } else {
//     console.log("Failed to load file");
//   }
// }

// function processExcel(data) {
//   var workbook = XLSX.read(data, {
//     type: "binary"
//   });

//   var firstSheet = workbook.SheetNames[0];
//   var data = to_json(workbook);
//   return data;
// }

// function to_json(workbook) {
//   var result = {};
//   workbook.SheetNames.forEach(function (sheetName) {
//     var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
//       header: 1
//     });
//     if (roa.length) result[sheetName] = roa;
//   });
//   return JSON.stringify(result, 2, 2);
// }

// // ----------------------------------------------
// // ------------  Generating Zip  ----------------
// // ----------------------------------------------

// downloadZipButton.addEventListener("click", function (e) {
//   // Start recording Time
//   var startTime = new Date();

//   console.log("Downloading Zip");


//   var zip = new JSZip();
//   var count = 0;
//   var totalRows = sheetData.length;
//   var zipFilename = "CERRT_SemiKolan.zip";
//   var effectiveDOMs = [];
//   var dataIndex = [];
//   Inputs.querySelectorAll(".certinputs").forEach(function (input) {
//     // console.log("input", input);
//     if (titles.includes(input.value)) {
//       input.dataset.editable = "1";
//       effectiveDOMs.push(input);
//       dataIndex.push(titles.indexOf(input.value));
//     }
//   });

//   sheetData.forEach(function (row, i) {
//     effectiveDOMs.forEach(function (dom, j) {
//       dom.value = row[dataIndex[j]];
//     });
//     drawTextfromInputs();

//     var filename = "Cerrt_" + (i + 1) + ".png";
//     var src = canvas.toDataURL("image/png");
//     // loading a file and add it in a zip file
//     JSZipUtils.getBinaryContent(src, function (err, data) {
//       if (err) {
//         throw err; // or handle the error
//       }
//       zip.file(filename, data, { binary: true });
//       count++;
//       if (count == sheetData.length) {
//         zip.generateAsync({ type: "blob" }).then(function (content) {
//           saveAs(content, zipFilename);
//           console.log("Certificate Downloaded");

//           // Print Time
//           var endTime = new Date();
//           var timeDiff = endTime - startTime;
//           console.log("Time Taken: " + timeDiff + "ms");
//           progress.innerHTML = `Generated ${totalRows} certificates in ${timeDiff / 1000} seconds`;


//           loaderbody.style.display = "flex";
//           effectiveDOMs.forEach(function (dom, j) {
//             dom.dataset.editable = "0";
//             dom.value = titles[dataIndex[j]];
//           });
//           drawTextfromInputs();
//           setTimeout(function () {
//             loaderbody.style.display = "none";
//           }, 5000);
//         });
//       }
//     });
//   });

//   // loaderbody.style.display = "none";
// });

document.addEventListener("DOMContentLoaded", function () {
  // Get references to the download button and file input
  const downloadButton = document.getElementById("downloadbutton");
  const fileInput = document.getElementById("doc-file");

  // Add a click event listener to the download button
  downloadButton.addEventListener("click", function () {
    // Trigger a click event on the file input
    fileInput.click();
  });

  // Function to handle file input change (you may already have this function)
  function get_Sha3() {
    // Your code to handle file input change goes here
    // ...
  }

  // Function to handle uploading the certificate (you may already have this function)
  function sendHash() {
    // Your code to upload the certificate goes here
    // ...
  }
});