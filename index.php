<?php
/*
	plugin name: CM Consulta Fipe
	Plugin uri: https://github.com/diegopereirabarbosa/plugin_wp_cm_fipe
	Description: Esse plugin fará acesso a tabela fipe de veículos do Brasil
	Version: 1.0
	License: GPLv2 or later
	Author: Diego Pereira
	Author uri: https://conectmotors.com.br


*/
function cm_consulta_fipe_register() {
    register_widget( 'cm_consulta_fipe' );
}

add_action( 'widgets_init', 'cm_consulta_fipe_register' );

function cm_carrega_scripts() {
    wp_enqueue_script("jquery");
    wp_enqueue_script('cm_fipe', plugin_dir_url(__FILE__) . 'js/cm_fipe.js',array('jquery'));
}
add_action( 'wp_enqueue_scripts', 'cm_carrega_scripts' );

class cm_consulta_fipe extends WP_Widget {

    function __construct() {
        parent::__construct(
// widget ID
            'cm_consulta_fipe',
// widget name
            __('CM Consulta Fipe', ' cm_widget_fipe'),
// widget description
            array( 'description' => __( 'Consulta a tabela fipe', 'cm_widget_fipe' ), )
        );
    }
    public function widget( $args, $instance ) {
        $title = apply_filters( 'widget_title', $instance['title'] );
        echo $args['before_widget'];
//if title is present
        if ( ! empty( $title ) )
            echo $args['before_title'] . $title . $args['after_title'];
//printa na tela
//echo __( 'Aqui vai o conteudo', 'cm_widget_fipe' );
        ?>
        <style>
            #valorSeguro {
                background: #d1e4dd;
                border: none;
            }
        </style>
        <form id="form_fipe" method="post">
            <div class="form-group">
                <label>Tabela fipe de veículos</label>
            </div>
            <div class="form-group">
                <select id="marcas" class="form-control round"></select>
            </div>
            <div class="form-group">
                <select id="modelos" class="form-control round"></select>
            </div>
            <div class="form-group">
                <select id="ano" class="form-control round"></select>
            </div>
            <div class="form-group">
                <p>Possui agregado?</p>
                <input id="comAgregado" type="radio" name="agregado" value="1" /> Sim
                <br />
                <input id="semAgregado" type="radio" name="agregado" value="0"/> Não
                <br />
            </div>
            <div class="form-group d-none" id="valorAgregado">
                <label>Informe o tipo agregado</label>
                <select  class="form-control round" name="tipoAgregado" id="tipoAgregado">
                    <option value="">Carroceria</option>
                    <option value="">Baú</option>
                    <option value="">Sider</option>
                    <option value="">Silo</option>
                    <option value="">Bi-trem</option>
                    <option value="">Camara fria</option>
                    <option value="">Caçamba</option>
                    <option value="">Tanque</option>
                    <option value="">Sider</option>
                    <option value="">Outro</option>
                </select>

                <label>Informe valor do agregado</label>
                <input  class="form-control round" type="number" value="undefined" id="agregado" required>
            </div>

            <div class="form-group">
                <p class="btn btn-success" id="continuar">Continuar</p>
            </div>
        </form>



        <table class="table" id="veiculo" style="width: 100%"></table>

        <?php
        echo $args['after_widget'];
    }
    public function form( $instance ) {
        if ( isset( $instance[ 'title' ] ) )
            $title = $instance[ 'title' ];
        else
            $title = __( 'Default Title', 'cm_widget_fipe' );
        ?>
        <p>
            <label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e( 'Title:' ); ?></label>
            <input class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" type="text" value="<?php echo esc_attr( $title ); ?>" />
        </p>
        <?php
    }
    public function update( $new_instance, $old_instance ) {
        $instance = array();
        $instance['title'] = ( ! empty( $new_instance['title'] ) ) ? strip_tags( $new_instance['title'] ) : '';
        return $instance;
    }

}
?>



