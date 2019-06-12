//Dont change it
requirejs(['ext_editor_io', 'jquery_190', 'raphael_210'],
    function (extIO, $) {
        function deliveryDroneCanvas(dom, data) {

            if (! data || ! data.ext) {
                return
            }

            const result = data.ext.result
            const output = data.out
            const input = data.in
            const explanation = data.ext.explanation

            /*----------------------------------------------*
             *
             * paper
             *
             *----------------------------------------------*/
            const points = input.length-1
            const scale = Math.min(1, 10/(points+1))
            const max_width = 350
            const paper = Raphael(dom, 350, 100, 0, 0);

            /*----------------------------------------------*
             *
             * attr
             *
             *----------------------------------------------*/
            const attr = {
                rect: {
                    'fill': 'black',
                    'stroke': '#DFE8F7',
                    'stroke-width': 0.1*scale + 'px',
                },
                number_line: {
                    'fill': 'black',
                    'stroke-width': scale + 'px',
                    'font-size': 10 + 'px',
                },
                package: {
                    paper: {
                        'fill': 'black',
                        'fill': '#8FC7ED',
                        'stroke-width': scale + 'px',
                    },
                    number: {
                        'font-size': 15*scale + 'px',
                        'fill': 'black',
                    },
                },
            }

            /*----------------------------------------------*
             *
             * drone icon
             *
             *----------------------------------------------*/
            const body_width = 30*scale
            const body_height = 8*scale
            const blade_width = 14*scale
            const blade_height = Math.max(1, 1*scale)
            const blade_float = 5*scale
            const arm_length = 10*scale
            const arm_width = 20*scale
            const drone_center = blade_width/2 + body_width/2
            const drone_float = 30*scale

            const start_height = 25*scale
            const grand_height = start_height +
                blade_float+body_height+arm_length+drone_float

            const parts = [
                // blade 1
                [0, start_height, blade_width, blade_height, 2],
                // blade 2
                [body_width, start_height, blade_width, blade_height,
                    2],
                // body 01
                [blade_width/2, start_height+blade_float, 
                    body_width, body_height, 2*scale],
                // arm 01
                [drone_center-arm_width/2-1, 
                    start_height+blade_float+body_height, 
                    1*scale, arm_length, 0.5*scale],
                // arm 02
                [drone_center+arm_width/2, 
                    start_height+blade_float+body_height, 
                    1*scale, arm_length, 0.5*scale],
            ]

            const drone_icon = paper.set()
            for (const part of parts) {
                drone_icon.push(paper.rect(...part.map(p=>p)).attr(
                    attr.rect))
            }

            /*----------------------------------------------*
             *
             * number line
             *
             *----------------------------------------------*/
            const number_line_length = 350 - drone_center*2
            const number_scale_height = 4*scale
            const number_height = 8

            paper.path(['M', drone_center, grand_height, 
                'l', number_line_length, 0]).attr(attr.number_line)

            for (let i = 0; i <= points; i += 1) {
                paper.path(['M', drone_center+i*number_line_length/(points),
                    grand_height, 'l', 0, number_scale_height]).attr(
                                attr.number_line)
                if (points < 10 || i % 5 == 0) {
                    paper.text(
                        drone_center+i*number_line_length/(points),
                        grand_height+number_scale_height+number_height, i
                    ).attr(attr.number_line)
                }
            }

            /*----------------------------------------------*
             *
             * packages icon
             *
             *----------------------------------------------*/
            const package_width = 18*scale
            const package_height = 20*scale
            const lifting_height = (grand_height - package_height)
                - (start_height+blade_float+blade_height+body_height)
            const p_dict = {}

            input.forEach((d, i)=>{
                if (d > 0) {
                    p_dict[i] = d
                }
            })

            for (let i = 0; i <= points; i += 1) {
                if (p_dict[i] > -1) {
                    const p_set = paper.set()
                    p_set.push(
                        paper.rect(
                            drone_center+i*number_line_length/(points)
                                - package_width/2, 
                            grand_height-package_height,
                                package_width, package_height, 
                            1*scale).attr(attr.package.paper))
                    p_set.push(
                        paper.text(
                            drone_center+i*number_line_length/(points),
                            grand_height-package_height/2, p_dict[i]).attr(
                                attr.package.number))

                    p_dict[i] = p_set
                }
            }

            /*----------------------------------------------*
             *
             * animation
             *
             *----------------------------------------------*/
            if (! result) {
                return
            }

            const unit = number_line_length / points
            const lift_speed = 200
            const move_speed = 800

            function transporting() {

                let i = -1;
                let transport = false
                let luggage = function(){};

                const done_dic = {};

                (function fn2(){

                    i += 1

                    if (i === explanation.length) {
                        return
                    }

                    const x = explanation[i]*unit

                    // drone down
                    function down () {
                        if (transport) {
                            luggage.animate(
                                {'transform': "t " + ((explanation[i]
                                    - explanation[i-1])*unit)
                                        + "," + 0}, lift_speed)
                            done_dic[explanation[i-1]] = 1
                        }
                        drone_icon.animate(
                            {'transform': "t " + x + ","
                                + lifting_height}, lift_speed, up)
                    }

                    function pk_up() {
                        p_dict[explanation[i]].animate({
                            'transform': "t " + 0 + "," + 
                                (-1 * lifting_height)}, lift_speed)
                        luggage = p_dict[explanation[i]]
                    }

                    // drone up
                    function up () {
                        if (p_dict[explanation[i]] 
                            && ! done_dic[explanation[i]]) {
                            if (! transport) {
                                transport = true
                                pk_up()
                            } else {
                                if (explanation[i] == explanation[i+1]) {
                                    i += 1
                                    pk_up()
                                } else {
                                    transport = false
                                }
                            }

                        } else {
                            transport = false
                        }

                        drone_icon.animate(
                            {'transform': "t " + x + "," + 0}, 
                            lift_speed, fn2)
                    }

                    // horizontal move
                    if (transport) {
                        luggage.animate(
                            {'transform': "t " + ((explanation[i]
                                - explanation[i-1])*unit)
                                + "," + (-1 * lifting_height)},
                            move_speed*(Math.abs(explanation[i]
                                - (explanation[i-1] || 0)))/(points+1))
                    }

                    drone_icon.animate(
                        {'transform': "t " + explanation[i]*unit + "," + 0},
                        move_speed*Math.abs(explanation[i]
                            - (explanation[i-1] || 0))/(points+1), 
                        explanation[i] > 0 ? down: ()=>{})

                })()
            }

            transporting()
        }

        var $tryit;
        var io = new extIO({
            multipleArguments: false,
            functions: {
                python: 'delivery_drone',
                js: 'deliveryDrone'
            },
            animation: function($expl, data){
                deliveryDroneCanvas(
                    $expl[0],
                    data,
                );
            }
        });
        io.start();
    }
);
