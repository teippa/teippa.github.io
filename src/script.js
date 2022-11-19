
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
      
      const maksuLopputulos = (p_saaja.price + p_maksaja.price).toFixed(3);

      if (maksuLopputulos <= 0) {
        result.maksut.push(`\t${p_saaja.name}:lle\t${p_maksaja.price.toFixed(3)} €\n`);
        p_saaja.price += p_maksaja.price;
        p_maksaja.price = 0;
        break;
      } else if (maksuLopputulos > 0) {
        result.maksut.push(`\t${p_saaja.name}:lle\t${-p_saaja.price.toFixed(3)} €\n`);
        p_maksaja.price += p_saaja.price;
        p_saaja.price = 0;
      }
      
    }
    results.push(result)
  }
  return results;
}


function createInput(type, value='') {
  d = document.createElement("div");
  d.className += " input-group mb-3"
  var mi = document.createElement("input");
  mi.setAttribute('type', type);
  mi.setAttribute('placeholder', value);
  mi.className += " form-control"
  d.appendChild(mi)
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
      summaCol.className += " col-md-4 col-sm-4"
      summaCol.appendChild(createInput("number", "esim. 25.50"))

    const kustannusCol = document.createElement('div');
      kustannusCol.className += " col-md-8 col-sm-8"
      kustannusCol.appendChild(createInput("text", "Esim. Limpparit"))



  detailRow.appendChild(summaCol);
  detailRow.appendChild(kustannusCol);

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
        button_newDetail.className += " btn btn-secondary"
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
      detail = detailsCollection[j]
      cost = parseFloat(detail.children[0].children[0].children[0].value);
      reason = detail.children[1].children[0].children[0].value;

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

  const results = distributeMoney(participants);

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

