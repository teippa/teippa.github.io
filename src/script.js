
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

function addStructure() {

  
  // const buttonsDiv = document.getElementById("buttons")

  // const button = document.createElement('button')
  //   button.innerText = 'Lisää osallistuja'
  //   button.class="btn btn-primary"
  //   button.type = "button"
  //   button.addEventListener('click', () => {
  //     addContributorField(mainTable)
  //   })
  //   buttonsDiv.appendChild(button)


  // const button_calc = document.createElement('button')
  //   button_calc.innerText = 'Laske'
  //   button_calc.addEventListener('click', () => {
  //     calculatePayments();
  //   })
  //   buttonsDiv.appendChild(button_calc)
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

function addDetailRow_old(table) {
  detailRow = document.createElement("tr");

    let cell_summa = document.createElement('td');
    cell_summa.appendChild(createInput("number", "esim. 25.50"));
    let cell_kustannus = document.createElement('td');
    cell_kustannus.appendChild(createInput("text", "Esim. Limpparit"));

  detailRow.appendChild(cell_summa);
  detailRow.appendChild(cell_kustannus);

  table.appendChild(detailRow)
}

function addDetailRow(detailsDiv) {
          //     <div class="row"> 
          //       <div class="col-lg-3 col-md-4">Summa(€)</div>
          //       <div class="col-lg-9 col-md-8">Kustannus</div> 
          //     </div>
  detailRow = document.createElement("div");
    detailRow.className += " row"

    const summaCol = document.createElement('div');
      summaCol.className += " col-lg-4 col-md-4"
      summaCol.appendChild(createInput("number", "esim. 25.50"))

    const kustannusCol = document.createElement('div');
      kustannusCol.className += " col-lg-8 col-md-8"
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
      nimiCol.className += " col-lg-3 col-md-4"
      nimiCol.appendChild(createInput("text", "esim. Makke"))

    const detailsCol = document.createElement('div');
      detailsCol.className += " col-lg-8 col-md-6"

    const buttonCol = document.createElement('div');
      buttonCol.className += " col-lg-1 col-md-2"
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


function addContributorField_old() {
  const table = document.getElementById("contributorTable");
  const row = document.createElement('tr');

  const cell_nimi = document.createElement('td');
    cell_nimi.appendChild(createInput("text", "esim. Makke"));

  const cell_details = document.createElement('td');
    const detailTable = document.createElement("table"); 
      const button_newDetail = document.createElement('div');
      button_newDetail.className += " btn btn-secondary"
      button_newDetail.innerText = '+';

      // Attach the "click" event to your button
      button_newDetail.addEventListener('click', () => {
        addDetailRow(detailTable);
      })
    cell_details.appendChild(detailTable);


  const cell_newSummaKust = document.createElement('td');
    cell_newSummaKust.appendChild(button_newDetail);

  row.appendChild(cell_nimi)
  row.appendChild(cell_details)
  row.appendChild(cell_newSummaKust)

  addDetailRow(detailTable)

  table.appendChild(row)

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

function collectData_old() {
  let participants = []
  const mainTable = document.getElementById("contributorTable");

  results = []
  for (let i = 1; i<mainTable.children.length; i++) {
    userRow = mainTable.children[i];

    nameCell = userRow.children[0].children[0];
    participant = new Participant(nameCell.value)


    detailsCollection = userRow.children[1].children[0].children;
    for (j = 0; j<detailsCollection.length; j++) {
      detail = detailsCollection[j]
      cost = parseFloat(detail.children[0].children[0].value);
      reason = detail.children[1].children[0].value;

      if (!cost) {cost = 0}

      // console.log(cost, reason)
      participant.price += parseFloat(cost);
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



const participants = [
  new Participant("Teijo", "50", "Kakku"),
  new Participant("Teemu", "20", "Kukka"),
  new Participant("Aapo", "50", "Kakka"),
  new Participant("Matti"),
]




addStructure()
