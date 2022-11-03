$("document").ready(() => {
  BuscaDadosParaMontarTabela();

  let regexCep = /^[0-9]{5}-[\d]{3}$/;

  $("#cep").focusout(function () {
    let cep = $(this).mask("00000-000").val();

    if (regexCep.test(cep)) {
      let urlApiCep = `https://cep.awesomeapi.com.br/json/${cep}`;
      $.ajax({
        url: urlApiCep,
        method: "GET",
        dataType: "json",
      }).done((data) => {
        $("#estado").val(data.state);
        $("#rua").val(data.address);
        $("#bairro").val(data.district);
        $("#cidade").val(data.city);
        $("#ddd").val(data.ddd);
        $("#numero").focus();
      });
    } else {
      $("#cep").focus();
    }
  });


function BuscaDadosParaMontarTabela() {
  let urlEndereco = `http://51.81.87.67:8085/endereco`; 
  $.ajax({
    url: urlEndereco,
    method: "GET",
    dataType: "json",
  }).done((data) => {
    montaTabelaDeEnderecos(data);
  });
}

function montaTabelaDeEnderecos(datas) {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
  datas?.forEach((data) => {
    tbody.innerHTML += `
                                  <tr>
                                          <th>${data.cep}</th>
                                          <td>${data.estado}</td>
                                          <td>${data.endereco}</td>
                                          <td>${data.numero}</td>
                                          <td>${data.complemento}</td>
                                          <td>${data.bairro}</td>
                                          <td>${data.cidade}</td>
                                          <td>${data.ddd}</td>
                                  </tr>
                                  `;
  });
}

$("#cadastrar_endereco").click(function() {
  let numero = $("#numero").val();

  if (numero !== "") {
    urlApiEndereco = `http://51.81.87.67:8085/endereco`;
    $.ajax({
      type: "POST",
      url: urlApiEndereco,
      data: {
        cep: $("#cep").val(),
        estado: $("#estado").val(),
        endereco: $("#rua").val(),
        numero: $("#numero").val(),
        bairro: $("#bairro").val(),
        complemento: $("#complemento").val(),
        cidade: $("#cidade").val(),
        ddd: $("#ddd").val(),
      },
    }).done(() => {
      BuscaDadosParaMontarTabela();
    });
  } else {
    alert("Digite um número");
  }
  limpaInput();
})

function limpaInput() {
  $("#cep").val("");
  $("#numero").val("");
  $("#complemento").val("");
  $("#estado").val("").attr("disabled", true);
  $("#rua").val("").attr("disabled", true);
  $("#bairro").val("").attr("disabled", true);
  $("#cidade").val("").attr("disabled", true);
  $("#ddd").val("").attr("disabled", true);
  $("#cep").focus();
}


$("#btn_limpar_tabela").click(function() {
  let url = `http://51.81.87.67:8085/reset`;
  $.ajax({
    url: url,
    method: "GET",
    dataType: "json",
  }).done((data) => {
    console.log(data)
   
  });
  alert("Deseja excluir os dados da tabela!")
  BuscaDadosParaMontarTabela();
})

});