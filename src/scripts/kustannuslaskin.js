
class Participant {
  constructor(name, price = 0, reason = "") {
    this.name = name;
    this.price = parseFloat(price);
    this.reason = reason;
  }

}

function distributeMoney(participants) {
  participants.sort((a, b) => { return a.price<b.price ? -1 : 1 })

  const totalPrice = participants.reduce((total, p) => { return total + p.price }, 0)
  const priceForEach = totalPrice/participants.length

  // console.log(totalPrice, priceForEach)


  // Calculate and print relative costs
  participants.forEach((p)=> {
    p.price = priceForEach - p.price
    // console.log(`${p.name}\t${p.price}\t${p.reason}`);
  })

  let summary = 'ew'
  if (priceForEach) {
    summary = `Yhteensä: ${totalPrice.toFixed(2)}€, ${priceForEach.toFixed(2)}€/hlö.`
  } else {
    summary = `Lisää osallistujia lomakkeeseen`
  }
  results = []

  for (let i = 0; i < participants.length; i++) {
    const p_maksaja = participants[i];

    if (p_maksaja.price.toFixed(5) <= 0) {
      continue
    }

    let result = {
      maksaja: `${p_maksaja.name} maksaa\n`,
      maksut: []
    }
    
      
    for (let j = participants.length-1; j >= 0; j--) {
      const p_saaja = participants[j];

      if (p_saaja.price.toFixed(5) == 0) {
        continue;
      }
      
      const maksuLopputulos = (p_saaja.price + p_maksaja.price).toFixed(2);

      if (maksuLopputulos <= 0) {
        result.maksut.push(`\t${p_saaja.name}:lle\t${p_maksaja.price.toFixed(2)} €\n`);
        p_saaja.price += p_maksaja.price;
        p_maksaja.price = 0;
        break;
      } else if (maksuLopputulos > 0) {
        result.maksut.push(`\t${p_saaja.name}:lle\t${-p_saaja.price.toFixed(2)} €\n`);
        p_maksaja.price += p_saaja.price;
        p_saaja.price = 0;
      }
      
    }
    results.push(result)
  }
  return [results, summary];
}


function createInput(type, value='') {
  d = document.createElement("div");
  d.className += " input-group input-group-sm mb-2"
  var mi = document.createElement("input");
    mi.className += " form-control"
    mi.setAttribute('type', type);
    mi.setAttribute('placeholder', value);
  d.appendChild(mi)
  return d
}

function createInputGroup(types, values=['', '']) {
  d = document.createElement("div");
  d.className += " input-group input-group-sm mb-1"

  var mi1 = document.createElement("input");
    mi1.className += " form-control col-sm-4"
    mi1.setAttribute('type', types[0]);
    mi1.setAttribute('placeholder', values[0]);

  var mi2 = document.createElement("input");
    mi2.className += " form-control col-sm-8"
    mi2.setAttribute('type', types[1]);
    mi2.setAttribute('placeholder', values[1]);

  d.appendChild(mi1)
  d.appendChild(mi2)
  return d
}


function addDetailRow(detailsDiv) {
          //     <div class="row"> 
          //       <div class="col-lg-3 col-md-4">Summa(€)</div>
          //       <div class="col-lg-9 col-md-8">Kustannus</div> 
          //     </div>
  detailRow = document.createElement("div");
    detailRow.className += " row"

    const summaCol = document.createElement('div');
      summaCol.className += " col-md-12 col-sm-12"
      summaCol.appendChild(createInputGroup(["number", "text"], ["esim. 25.50", "Esim. Limpparit"]))

    // const kustannusCol = document.createElement('div');
    //   kustannusCol.className += " col-md-8 col-sm-8"
    //   kustannusCol.appendChild(createInput("text", "Esim. Limpparit"))



  detailRow.appendChild(summaCol);
  // detailRow.appendChild(kustannusCol);

  detailsDiv.appendChild(detailRow)
}

function addContributorField() {

          // <div class="row"> 
          //   <div class="col-lg-3 col-md-4">Nimi</div>
          //   <div class="col-lg-6 col-md-6">
          //   </div>
          //   <div class="col-lg-3 col-md-2">+</div> 
          // </div> 
  const contributorsDiv = document.getElementById("contributorDiv");

  const row = document.createElement('div');
    row.className += " row"

    const nimiCol = document.createElement('div');
      nimiCol.className += " col-md-3 col-sm-12"
      nimiCol.appendChild(createInput("text", "esim. Makke"))

    const detailsCol = document.createElement('div');
      detailsCol.className += " col-md-8 col-sm-11"

    const buttonCol = document.createElement('div');
      buttonCol.className += " col-md-1 col-sm-1"
        const button_newDetail = document.createElement('div');
        button_newDetail.className += " btn btn-sm btn-secondary"
        button_newDetail.innerText = '+';

        // Attach the "click" event to your button
        button_newDetail.addEventListener('click', () => {
          addDetailRow(detailsCol);
        })
        buttonCol.appendChild(button_newDetail)


  row.appendChild(nimiCol)
  row.appendChild(detailsCol)
  row.appendChild(buttonCol)
  contributorsDiv.appendChild(row)

  addDetailRow(detailsCol)
}




function collectData() {
  let participants = []
  const contributorDiv = document.getElementById("contributorDiv");

  results = []
  for (let i = 0; i<contributorDiv.children.length; i++) {
    userRow = contributorDiv.children[i];

    nameCell = userRow.children[0].children[0].children[0];
    participant = new Participant(nameCell.value)

    detailsCollection = userRow.children[1].children;
    for (j = 0; j<detailsCollection.length; j++) {
      detail = detailsCollection[j].children[0].children[0]
      // console.log(detail)
      cost = parseFloat(detail.children[0].value);
      reason = detail.children[1].value;

      if (!cost) {cost = 0}

      participant.price += cost;
      participant.reason += `${reason}, `
    }
    participants.push(participant)
  }
  return participants
}

const removeChilds = (parent) => {
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
};

function calculatePayments() {
  const participants = collectData();

  const out = distributeMoney(participants);
  const results = out[0];
  const summary = out[1];

  const summaryDiv = document.getElementById("summary");
  summaryDiv.innerText = summary;

  const maksajatList = document.getElementById("results");
  removeChilds(maksajatList)
  // console.log(results)


  results.forEach((r) => {
    // console.log(r.maksaja)
    const a1 = document.createElement("li")
    a1.innerText = r.maksaja;
    maksajatList.appendChild(a1)

    maksettavatList = document.createElement("ul")
    maksettavatList.className += " results_b"
    maksajatList.appendChild(maksettavatList)

    r.maksut.forEach((m) => {
      const b1 = document.createElement("li")
      b1.innerText = m;
      maksettavatList.appendChild(b1)
      // console.log(m)
    })
  })
}

addContributorField()