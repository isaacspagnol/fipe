jQuery(document).ready(function($) {
    var urlBase = "//parallelum.com.br/fipe/api/v1";
    /** Marcas**/
    $(document).ready(function () {
        $.getJSON(urlBase + "/" + "caminhoes" + "/" + "marcas", function (data) {
            var items = ["<option value=\"\">Selecione uma marca</option>"];
            $.each(data, function (key, val) {
                items += ("<option value='" + val.codigo + "'>" + val.nome + "</option>");
            });
            $("#marcas").html(items);
        });
    });

    /** Veiculo**/

    $("#marcas").change(function () {
        $.getJSON(urlBase + "/" + "caminhoes" + "/" + "marcas" + "/" + jQuery("#marcas").val() + "/" + "modelos", function (data) {
            var items = ["<option value=\"\">Selecione o modelo</option>"];
            $.each(data.modelos, function (key, val) {
                items += ("<option value='" + val.codigo + "'>" + val.nome + "</option>");
            });
            $("#modelos").html(items);
        });
    });

    /** Ano**/

    $("#modelos").change(function () {
        $.getJSON(urlBase + "/" + "caminhoes" + "/" + "marcas" + "/" + jQuery("#marcas").val() + "/" + "modelos" + "/" + jQuery("#modelos").val() + "/" + "anos", function (data) {
            var items = ["<option value=\"\">Selecione o ano</option>"];
            $.each(data, function (key, val) {
                console.log(data)
                items += ("<option value='" + val.codigo + "'>" + val.nome + "</option>");
            });
            $("#ano").html(items);
        });
    });
    /*--------Dados completo---------*/


//    MARCA E DESMARCA RADIO SELECT
    $('input[type=radio]').click(function () {
        if (this.previous) {
            this.checked = false;
        }
        this.previous = this.checked;
    });


// MOSTRA E OCULTA CAMPO VALOR DO AGREGADO
    $("#comAgregado").on('click', function () {
        $("#valorAgregado").fadeIn("slow").removeClass('d-none');
    });
    $("#semAgregado").on('click', function () {
        $("#valorAgregado").fadeOut("slow");
    });


//   VERIFICA SE HOUVE ALTERAÇÃO NO CAMPO #ANO

    $("#ano").change(function () {
        $.getJSON(urlBase + "/" + "caminhoes" + "/" + "marcas" + "/" + jQuery("#marcas").val() + "/" + "modelos" + "/" + jQuery("#modelos").val() + "/" + "anos" + "/" + jQuery("#ano").val(), function (dados) {
            var items;
            var data = new Date();
            var dia = data.getDate();
            var mes = data.getMonth() + 1;
            var ano = data.getFullYear();
            var str_data = dia + "/" + mes + "/" + ano;

// PEGA O CLICK DO BUTTON E FAZ A CONTA
            $("#continuar").on('click', function () {
                let valorFipe = dados.Valor;
                valorFipe = valorFipe.replace(/[R$]+/g, '');
                valorFipe = valorFipe.replace(".", "");
                valorFipe = valorFipe.replace(",", ".");
                valorFipe = parseFloat(valorFipe);
                console.log(valorFipe);

// VARIAVEIS DE VALORES
                let vitalico = 91;
                let mensal = 100;
                let taxaMenor200 = 0.32;
                let taxaMaior200 = 0.31;
                let agregado = $('#agregado').val();
                agregado = parseFloat(agregado);


// PEGA VALOR DO RADIO AGREGADO
                let comOuSemAgregado = $('input[name=agregado]:checked', '#form_fipe').val();

                //se tiver agregado
                if (comOuSemAgregado == 1) {
                    let fipeAgregado = valorFipe + agregado;
                    console.log('fipe com agregado ' + fipeAgregado.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}));



                    // Valor fixo de for menor a 110 mil reais
                    if (fipeAgregado <= 110000) {
                        let valorFinal = 442;
                        console.log(valorFinal.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}));
                    }

                    // calcula valor da parcela caso for mais que 110mil e menor que 200mil
                    if ((fipeAgregado > 110000) && (fipeAgregado < 200000)) {
                        let valorAnual = fipeAgregado * taxaMenor200;
                        let valorMensal = valorAnual / mensal;
                        let valorFinal = valorMensal + vitalicio;
                        console.log(valorFinal.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}));
                    }

                    //  calucula valor da parcela caso for maior que 200mil
                    if (fipeAgregado > 200000) {
                        let valorAnual = fipeAgregado * taxaMaior200;
                        let valorMensal = valorAnual / mensal;
                        let valorFinal = valorMensal + vitalico;
                        console.log(valorFinal.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}));

                    }

                } else {
                    console.log('fipe sem agregado ' + valorFipe.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}));

                    // Valor fixo de for menor a 110 mil reais
                    if (valorFipe <= 110000) {
                        var valorFinal = 442;
                        console.log(valorFinal.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}));
                    }

                    // calcula valor da parcela caso for mais que 110mil e menor que 200mil
                    if ((valorFipe > 110000) && (valorFipe < 200000)) {
                        let valorAnual = valorFipe * taxaMenor200;
                        let valorMensal = valorAnual / mensal;
                        let valorFinal = valorMensal + vitalico;
                        console.log(valorFinal.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}));

                    }

                    //  calucula valor da parcela caso for maior que 200mil
                    if ((valorFipe > 200000)) {
                        let valorAnual = valorFipe * taxaMaior200;
                        let valorMensal = valorAnual / mensal;
                        let valorFinal = valorMensal + vitalico;
                        console.log(valorFinal.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}));

                    }
                }

            });
        });
    });
});





