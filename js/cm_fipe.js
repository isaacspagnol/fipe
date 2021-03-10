jQuery(document).ready(function($) {
    var urlBase = "//parallelum.com.br/fipe/api/v1";
    /** Marcas**/
    $(document).ready(function() {
        $.getJSON(urlBase + "/" + "caminhoes" + "/" + "marcas", function(data) {
            var items = ["<option value=\"\">Selecione uma marca</option>"];
            $.each(data, function(key, val) {
                items += ("<option  value='" + val.codigo + "'>" + val.nome + "</option>");
            });
            $("#marcas").html(items);
        });
    });

    /** Veiculo**/

    $("#marcas").change(function() {
        $.getJSON(urlBase + "/" + "caminhoes" + "/" + "marcas" + "/" + jQuery("#marcas").val() + "/" + "modelos", function(data) {
            var items = ["<option value=\"\">Selecione o modelo</option>"];
            $.each(data.modelos, function(key, val) {
                items += ("<option value='" + val.codigo + "'>" + val.nome + "</option>");
            });
            $("#modelos").html(items);
        });
    });

    /** Ano**/

    $("#modelos").change(function() {
        $.getJSON(urlBase + "/" + "caminhoes" + "/" + "marcas" + "/" + jQuery("#marcas").val() + "/" + "modelos" + "/" + jQuery("#modelos").val() + "/" + "anos", function(data) {
            var items = ["<option value=\"\">Selecione o ano</option>"];
            $.each(data, function(key, val) {
                console.log(data)
                items += ("<option value='" + val.codigo + "'>" + val.nome + "</option>");
            });
            $("#ano").html(items);
        });
    });
    /*--------Dados compvaro---------*/


    //    MARCA E DESMARCA RADIO SELECT
    $('input[type=radio]').click(function() {
        if (this.previous) {
            this.checked = false;
        }
        this.previous = this.checked;
    });


    // MOSTRA E OCULTA CAMPO VALOR DO AGREGADO
    $("#comAgregado").on('click', function() {
        $("#valorAgregado").fadeIn("slow").removeClass('d-none');
    });
    $("#semAgregado").on('click', function() {
        $("#valorAgregado").fadeOut("slow");
    });

    //  Mascaras de campos
    $('.valor-do-agregado').mask('#.##0,00', {
        reverse: true
    })
    $('.telefone').maskbrphone();

    $('.telefone').maskbrphone({
        useDdd: true, // Define se o usuário deve digitar o DDD  
        useDddParenthesis: true, // Informa se o DDD deve estar entre parênteses  
        dddSeparator: ' ', // Separador entre o DDD e o número do telefone  
        numberSeparator: '-' // Caracter que separa o prefixo e o sufixo do telefone  
    });



    //   VERIFICA SE HOUVE ALTERAÇÃO NO CAMPO #ANO

    $("#ano").change(function() {
        $.getJSON(urlBase + "/" + "caminhoes" + "/" + "marcas" + "/" + jQuery("#marcas").val() + "/" + "modelos" + "/" + jQuery("#modelos").val() + "/" + "anos" + "/" + jQuery("#ano").val(), function(dados) {
            var items;
            var data = new Date();
            var dia = data.getDate();
            var mes = data.getMonth() + 1;
            var ano = data.getFullYear();
            var str_data = dia + "/" + mes + "/" + ano;

             var valorFipe = dados.Valor;
             valorFipe = valorFipe.replace(/[R$]+/g, '');
             valorFipe = valorFipe.replace(".", "");
             valorFipe = valorFipe.replace(",", ".");
             valorFipe = parseFloat(valorFipe);
             console.log(valorFipe);

             // VARIAVEIS DE VALORES
             const vitalicio    = 91;
             const mensal       = 100;
             const taxaMenor200 = 0.32;
             const taxaMaior200 = 0.31;
             const cobTerceiro1 = 120;
             const cobTerceiro2 = 180;
             const cobTerceiro3 = 200;
             const cobTerceiro4 = 230;
             const cobTerceiro5 = 250;
             const cobTerceiro6 = 280;
             const cobTerceiro7 = 310;
             const cobTerceiro8 = 500;
             const guinchoOuro  = 30;
             const guinchoDiama = 63

            //  VERIFICAR PORQUE NÃO PRINTA VALOR DO agregado
            //  TRANSFORMAR O CALCULO DO TERCEIRO E DO GUNCHO EM FUNCÃO E CHAMAR NA CONTA

              // Dados do caminhão
              var marca           = $("#marcas  :selected").text();
              var modelo          = $("#modelos :selected").text();
              var ano             = $("#ano :selected").text();
              var valorDoAgregado = $('input[name=agregado]:checked', '#form_fipe_stage_1').val();
 
              $(document).change (function montaResumo() {
                  var resumo = ["<h1>Dados do seu caminhão </h1> <p>Marca:" + marca + "</p> <p> Modelo:" + modelo + "</p> <p>Ano do caminhão" + ano + "</p> <p> Valor da fipe:" + valorFipe.toLocaleString('pt-br', {style: 'currency',currency: 'BRL'}) + "</p> <p>Valor do agregado:" + valorDoAgregado + "</p>" ];
                  $("#resumoCaminhao").html(resumo);
              });
 

            

            // PEGA O CLICK DO BUTTON E FAZ A CONTA
            $("#continuar").on('click', function() {


                var agregado = $('#agregado').val();
                agregado     = agregado.replace(".", "");
                agregado     = agregado.replace(",", ".");
                agregado     = parseFloat(agregado);
                console.log(agregado);
                // manda para o stage_2
                $("#form_fipe_stage_2").fadeIn("slow").removeClass('d-none');
                $("#form_fipe_stage_1").fadeOut("slow").addClass('d-none');

               
   
                // PEGA VALOR DO RADIO AGREGADO
                var comOuSemAgregado = $('input[name=agregado]:checked', '#form_fipe_stage_1').val();

                //se tiver agregado
                if (comOuSemAgregado == 1) {
                    var fipeAgregado = valorFipe + agregado;
                    console.log('fipe com agregado ' + fipeAgregado.toLocaleString('pt-br', {
                        style: 'currency',
                        currency: 'BRL'
                    }));



                    // Valor fixo de for menor a 110 mil reais
                    if (fipeAgregado <= 110000) {
                        var valorFinal = 442;
                        console.log(valorFinal.toLocaleString('pt-br', {
                            style: 'currency',
                            currency: 'BRL'
                        }));

                        //Verifica se qual opcao de guincho e terceiro foi selecionada
                        var cobTerceiros = $('input[name=coberturaTerceiro]:checked', '#form_fipe_stage_1').val();
                        var guincho = $('input[name=guincho]:checked', '#form_fipe_stage_1').val();

                        $(function() {

                            if (guincho == 0) {
                                var finalComGuinco = valorFinal;
                            }
                            if (guincho == 1) {
                                var finalComGuinco = valorFinal + guinchoOuro;
                            }

                            if (guincho == 2) {
                                var finalComGuinco = valorFinal + guinchoDiama;
                            }


                            if (cobTerceiros == 1) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro1;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                // var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                // $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                                montaResumo();
                            }

                            if (cobTerceiros == 2) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro2;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }

                            if (cobTerceiros == 3) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro3;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }

                            if (cobTerceiros == 4) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro4;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }
                            if (cobTerceiros == 5) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro5;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }
                            if (cobTerceiros == 6) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro6;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }
                            if (cobTerceiros == 7) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro7
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }
                            if (cobTerceiros == 8) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro8;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }
                        });

                    }

                    // calcula valor da parcela caso for mais que 110mil e menor que 200mil
                    if ((fipeAgregado > 110000) && (fipeAgregado < 200000)) {
                        var valorAnual = fipeAgregado * taxaMenor200;
                        var valorMensal = valorAnual / mensal;
                        var valorFinal = valorMensal + vitalicio;
                        console.log(valorFinal.toLocaleString('pt-br', {
                            style: 'currency',
                            currency: 'BRL'
                        }));

                        //Verifica se qual opcao de guincho e terceiro foi selecionada
                        var cobTerceiros = $('input[name=coberturaTerceiro]:checked', '#form_fipe_stage_1').val();
                        var guincho = $('input[name=guincho]:checked', '#form_fipe_stage_1').val();
                        $(function() {

                            if (guincho == 0) {
                                var finalComGuinco = valorFinal;
                            }
                            if (guincho == 1) {
                                var finalComGuinco = valorFinal + guinchoOuro;
                            }

                            if (guincho == 2) {
                                var finalComGuinco = valorFinal + guinchoDiama;
                            }


                            if (cobTerceiros == 1) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro1;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }

                            if (cobTerceiros == 2) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro2;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }

                            if (cobTerceiros == 3) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro3;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }

                            if (cobTerceiros == 4) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro4;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }
                            if (cobTerceiros == 5) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro5;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }
                            if (cobTerceiros == 6) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro6;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }
                            if (cobTerceiros == 7) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro7
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }
                            if (cobTerceiros == 8) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro8;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }
                        });

                    }

                    //  calucula valor da parcela caso for maior que 200mil
                    if (fipeAgregado > 200000) {
                        var valorAnual = fipeAgregado * taxaMaior200;
                        var valorMensal = valorAnual / mensal;
                        var valorFinal = valorMensal + vitalicio;
                        console.log(valorFinal.toLocaleString('pt-br', {
                            style: 'currency',
                            currency: 'BRL'
                        }));

                        //Verifica se qual opcao de guincho e terceiro foi selecionada
                        var cobTerceiros = $('input[name=coberturaTerceiro]:checked', '#form_fipe_stage_1').val();
                        var guincho = $('input[name=guincho]:checked', '#form_fipe_stage_1').val();
                        $(function() {

                            if (guincho == 0) {
                                var finalComGuinco = valorFinal;
                            }
                            if (guincho == 1) {
                                var finalComGuinco = valorFinal + guinchoOuro;
                            }

                            if (guincho == 2) {
                                var finalComGuinco = valorFinal + guinchoDiama;
                            }


                            if (cobTerceiros == 1) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro1;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }

                            if (cobTerceiros == 2) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro2;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }

                            if (cobTerceiros == 3) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro3;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }

                            if (cobTerceiros == 4) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro4;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }
                            if (cobTerceiros == 5) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro5;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }
                            if (cobTerceiros == 6) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro6;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }
                            if (cobTerceiros == 7) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro7
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }
                            if (cobTerceiros == 8) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro8;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }
                        });

                    }

                } else {
                    console.log('fipe sem agregado ' + valorFipe.toLocaleString('pt-br', {
                        style: 'currency',
                        currency: 'BRL'
                    }));

                    // Valor fixo de for menor a 110 mil reais
                    if (valorFipe <= 110000) {
                        var valorFinal = 442;
                        console.log(valorFinal.toLocaleString('pt-br', {
                            style: 'currency',
                            currency: 'BRL'
                        }));

                        //Verifica se qual opcao de guincho e terceiro foi selecionada
                        var cobTerceiros = $('input[name=coberturaTerceiro]:checked', '#form_fipe_stage_1').val();
                        var guincho = $('input[name=guincho]:checked', '#form_fipe_stage_1').val();
                        $(function() {

                            if (guincho == 0) {
                                var finalComGuinco = valorFinal;
                            }
                            if (guincho == 1) {
                                var finalComGuinco = valorFinal + guinchoOuro;
                            }

                            if (guincho == 2) {
                                var finalComGuinco = valorFinal + guinchoDiama;
                            }


                            if (cobTerceiros == 1) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro1;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }

                            if (cobTerceiros == 2) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro2;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }

                            if (cobTerceiros == 3) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro3;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }

                            if (cobTerceiros == 4) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro4;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }
                            if (cobTerceiros == 5) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro5;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }
                            if (cobTerceiros == 6) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro6;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }
                            if (cobTerceiros == 7) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro7
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }
                            if (cobTerceiros == 8) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro8;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }
                        });

                    }

                    // calcula valor da parcela caso for mais que 110mil e menor que 200mil
                    if ((valorFipe > 110000) && (valorFipe < 200000)) {
                        var valorAnual = valorFipe * taxaMenor200;
                        var valorMensal = valorAnual / mensal;
                        var valorFinal = valorMensal + vitalicio;
                        console.log(valorFinal.toLocaleString('pt-br', {
                            style: 'currency',
                            currency: 'BRL'
                        }));

                        //Verifica se qual opcao de guincho e terceiro foi selecionada
                        var cobTerceiros = $('input[name=coberturaTerceiro]:checked', '#form_fipe_stage_1').val();
                        var guincho = $('input[name=guincho]:checked', '#form_fipe_stage_1').val();
                        $(function() {

                            if (guincho == 0) {
                                var finalComGuinco = valorFinal;
                            }
                            if (guincho == 1) {
                                var finalComGuinco = valorFinal + guinchoOuro;
                            }

                            if (guincho == 2) {
                                var finalComGuinco = valorFinal + guinchoDiama;
                            }


                            if (cobTerceiros == 1) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro1;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                                montaResumo();
                            }

                            if (cobTerceiros == 2) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro2;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }

                            if (cobTerceiros == 3) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro3;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }

                            if (cobTerceiros == 4) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro4;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }
                            if (cobTerceiros == 5) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro5;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }
                            if (cobTerceiros == 6) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro6;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }
                            if (cobTerceiros == 7) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro7
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }
                            if (cobTerceiros == 8) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro8;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }
                        });

                    }

                    //  calucula valor da parcela caso for maior que 200mil
                    if ((valorFipe > 200000)) {
                        var valorAnual = valorFipe * taxaMaior200;
                        var valorMensal = valorAnual / mensal;
                        var valorFinal = valorMensal + vitalicio;
                        console.log(valorFinal.toLocaleString('pt-br', {
                            style: 'currency',
                            currency: 'BRL'
                        }));

                        //Verifica se qual opcao de guincho e terceiro foi selecionada
                        var cobTerceiros = $('input[name=coberturaTerceiro]:checked', '#form_fipe_stage_1').val();
                        var guincho = $('input[name=guincho]:checked', '#form_fipe_stage_1').val();
                        $(function() {

                            if (guincho == 0) {
                                var finalComGuinco = valorFinal;
                            }
                            if (guincho == 1) {
                                var finalComGuinco = valorFinal + guinchoOuro;
                            }

                            if (guincho == 2) {
                                var finalComGuinco = valorFinal + guinchoDiama;
                            }


                            if (cobTerceiros == 1) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro1;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }

                            if (cobTerceiros == 2) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro2;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }

                            if (cobTerceiros == 3) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro3;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }

                            if (cobTerceiros == 4) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro4;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }
                            if (cobTerceiros == 5) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro5;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }
                            if (cobTerceiros == 6) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro6;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }
                            if (cobTerceiros == 7) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro7
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }
                            if (cobTerceiros == 8) {
                                var finalComTerceiro = finalComGuinco + cobTerceiro8;
                                var valorFormatadoReal = finalComTerceiro.toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                                var resultado = ["<input value='" + valorFormatadoReal + "'>"];
                                $("#valorDaParcela").html(resultado);
                                console.log(valorFormatadoReal);
                            }
                        });

                    }
                }


            });

            $("#voltar-1").on('click', function() {
                // manda de volta para o stage_1
                $("#form_fipe_stage_1").fadeIn("slow").removeClass('d-none');
                $("#form_fipe_stage_2").fadeOut("slow").addClass('d-none');
            });


            $("#voltar-2").on('click', function() {
                // manda de volta para o stage_1
                $("#form_fipe_stage_2").fadeIn("slow").removeClass('d-none');
                $("#form_fipe_stage_3").fadeOut("slow").addClass('d-none');
            });



            // salva os dados form stage_2 e manda via get para o email.php
            $("#continuar-2").on('click', function() {

                $("#form_fipe_stage_3").fadeIn("slow").removeClass('d-none');
                $("#form_fipe_stage_2").fadeOut("slow").addClass('d-none');






                

                // Dados pessoais
                var nome           = $("#nome").val();
                var email          = $("#email").val();
                var telefone       = $("#telefone").val();
                var estado         = $("#estado :selected").text();
                var cidade         = $("#cidade").val();
                var possuiProtecao = $('input[name=comOuSemProtecao]:checked', '#form_fipe_stage_2').val();

                console.log(marca, modelo, ano, agregado, nome, email, telefone, estado, cidade, possuiProtecao);

                if (nome == "" || null && email == "" || null && telefone == "" || null && estado == "" || null && cidade == "" || null && possuiProtecao == "" || null) {
                    alert("prencha os campos");
                    return false;
                } else {
                    // alert("enviando email");
                    $.get('email.php', {
                        nome: nome,
                        email: email,
                        telefone: telefone,
                        estado: estado,
                        cidade: cidade,
                        possuiProtecao: possuiProtecao
                    }, function(envia) {

                        $("#status").slideDown();

                        if (envia != 1) {
                            $("#alert-danger").show();
                            $("#id").css("display", "none");
                            $("#id").css("display", "block");
                        } else {
                            $("#alert-success").show();
                            alert('Mensagem enviada com sucesso!');
                            $("#nome").val("");
                            $("#email").val("");
                            $("#assunto").val("");
                            $("#telefone").val("");
                            $("#mensagem").val("");
                            $(".radio").val("");
                        }

                        return false;

                    });
                }

                
               
            });

        });
    });
});