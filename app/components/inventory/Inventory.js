import React from 'react'
import TitleTop from './titleTop'
import { connect } from 'react-redux'


window.Y_top = 0;
window.X_left = 0;
class Inventory extends React.Component{
    constructor(props){
        super(props);
        Object.assign(this,{props});
        this.scroll = this.scroll.bind(this);
        this.move = this.move.bind(this);
        this.drawX = this.drawX.bind(this);
        this.d_m_x = this.d_m_x.bind(this);
    }

    componentDidUpdate() {
        this.refs.InvScroll.setAttribute('touch-action','none');
        this.refs.InvScroll.addEventListener('pointerdown',this.scroll,false);
        this.refs.InvScroll_X.setAttribute('touch-action','none');
        this.refs.InvScroll_X.addEventListener('pointerdown',this.drawX,false);
        if(this.setData.currentSelect === 0 && Object.keys(this.data['动物']).length <= 3){
            this.refs.InvRullBar.style.display = 'none';
        } else if(this.setData.currentSelect === 0 && Object.keys(this.data['动物']).length > 3){
            this.refs.InvRullBar.style.display = 'block';
        }

        if(this.setData.currentSelect === 1 && Object.keys(this.data['建筑']).length <= 3){
            this.refs.InvRullBar.style.display = 'none';
        }else if(this.setData.currentSelect === 1 && Object.keys(this.data['建筑']).length > 3){
            this.refs.InvRullBar.style.display = 'block';
        }

        if(this.setData.currentSelect === 2 && Object.keys(this.data['交通工具']).length <= 3){
            this.refs.InvRullBar.style.display = 'none';
        }else if(this.setData.currentSelect === 2 && Object.keys(this.data['交通工具']).length > 3){
            this.refs.InvRullBar.style.display = 'block';
        }

        if(this.setData.currentSelect === 3 && Object.keys(this.data['人物']).length <= 3){
            this.refs.InvRullBar.style.display = 'none';
        }else if(this.setData.currentSelect === 3 && Object.keys(this.data['人物']).length > 3){
            this.refs.InvRullBar.style.display = 'block';
        }

        if(this.setData.currentSelect === 4 && Object.keys(this.data['物品']).length <= 3){
            this.refs.InvRullBar.style.display = 'none';
        }else if(this.setData.currentSelect === 4 && Object.keys(this.data['物品']).length > 3){
            this.refs.InvRullBar.style.display = 'block';
        }

        if(this.setData.currentSelect === 5 && Object.keys(this.data['植物']).length <= 3){
            this.refs.InvRullBar.style.display = 'none';
        }else if(this.setData.currentSelect === 5 && Object.keys(this.data['植物']).length > 3){
            this.refs.InvRullBar.style.display = 'block';
        }
    }
    //滚动条的拖拽
    scroll(event) {
        event = event || window.event;
        this.mouseY = event.clientY - Y_top;//鼠标按下时滚动调在浏览器窗口内的位置
        this.InvRullBar_H = this.refs.InvRullBar.clientHeight-25;
        //封装toy内容向下拉动 函数
        this.set_toy_Y = (ref,ul_h) => {
            ref.style.top = -((ul_h.offsetHeight-this.refs.box.offsetHeight)*(Y_top/this.InvRullBar_H)) + 'px';
        };
        document.addEventListener('pointermove',this.move,false);
        document.addEventListener('pointerup',() => {
            //清空move效果
            document.removeEventListener('pointermove',this.move);
        },false);
    }
    move(event) {
        event = event || window.event;
        Y_top = event.clientY - this.mouseY;
        // console.log(Y_top);
        if(Y_top < 0) Y_top = 0;
        if(Y_top > this.InvRullBar_H) Y_top = this.InvRullBar_H;
        if (Y_top >= 0 && Y_top <= this.InvRullBar_H){
            this.refs.InvScroll.style.top = Y_top + 'px';
            //调用set_toy_Y函数
            for(let i = 1; i <= 6; i++) {
                this.set_toy_Y(this.refs['category' + i],this.refs['category' + i]);
                this.set_toy_Y(this.refs['itemsLine' + i],this.refs['category' + i]);
            }
        }
    }

    //内容的横向拖拽
    drawX(event) {
        event = event || window.event;
        let target = event.srcElement ? event.srcElement : event.target;
        this.target = target;
        this.startX = event.clientX;
        //定义num变量（用于定义下面移动时 接收当前clientX的序号）
        this.num = 0;
        this['clientX'+this.num] = event.clientX;
        let move = (ref) => {
            if(this.setData.currentSelect === 0){
                console.log(this['动物'], '数量');
                this.ul_width = (this['动物']) * 84 - 630;
                this.x = 3
            }
            if(this.setData.currentSelect === 1){
                console.log(this['建筑'], '数量');
                this.ul_width = (this['建筑'] - 1) * 84 - 630;
                this.x = 4
            }
            if(this.setData.currentSelect === 2){
                console.log(this['交通工具'], '数量');
                this.ul_width = (this['交通工具'] - 1) * 84 -630;
                this.x = 1
            }
            if(this.setData.currentSelect === 3){
                console.log(this['人物'], '数量');
                // 这个this['人物']和模型数量不符
                this.ul_width = (this['人物'] - 1) * 84 - 630;
                this.x = 2
            }
            if(this.setData.currentSelect === 4){
                // 6.21添加
                console.log('syl')
                console.log(this['物品'], '数量');
                this.ul_width = (this['物品']) * 84 - 630;
                this.x = 6
            }
            if(this.setData.currentSelect === 5){
                console.log(this['植物'], '数量');
                this.ul_width = (this['植物']) * 84 - 630;
                this.x = 5
                console.log(this.ul_width, 'ul_width')
            }
            let inventory_width;
            if( document.body.clientWidth <= 1800) {
                // inventory_width = 455
                // 6.21
                console.log('<1800')
                inventory_width = 455
            }else {
                // inventory_width = 435
                // 6.21
                console.log('>1800')
                // inventory_width = 390
                inventory_width = 350
            }
            //可移动最大距离
            // this.moveX = this.ul_width - inventory_width;
            // 6.21修改
            this.moveX = this.ul_width;
            console.log(this.moveX, '移动最大距离')
            if(this.moveX > 0){
                // console.log(this.moveX);
                document.addEventListener('pointermove',this.d_m_x,false);

                document.addEventListener('pointerup',() => {
                    //清空move效果
                    document.removeEventListener('pointermove',this.d_m_x);
                },false);
            }
        };
        let ref = event.target;
        move(ref);
    }
    //拖拽moveX
    d_m_x(event) {
        event = event || window.event;
        X_left = event.clientX - 117;
        if(event.clientX - 117 <= 0) X_left = 0;
        let max_X = this.refs.InvRullBar_X.offsetWidth-27;
        if(event.clientX - 117 >= max_X) X_left = max_X;
        this.refs.InvScroll_X.style.left = X_left + 'px';
        let X = this.moveX/max_X;
        this.refs['itemsLine' + this.x].style.left = -X_left*X + 'px';
    }
    render(){
        //阻止react第一次无数据的渲染
        // console.log(this.props);
        if(!this.props.getToy.isInit) return <div></div>;
        //获取action之后的数据
        this.setData = this.props.titleTop;
        //获取虚拟DOM
        let box_child = this.refs.box;
        //判断页面是否渲染
        if(box_child) {
            for (let i = 0; i < box_child.childNodes.length ; i ++) {
                //全部隐藏
                box_child.childNodes[i].style.display = "none";
                //重置所有二级标题栏的top值
                box_child.childNodes[i].firstChild.style.top = this.setData.toyTop + 'px';
                let toyContent = box_child.childNodes[i].lastChild;
                //重置toy 内容的top值
                toyContent.style.top = this.setData.toyTop + 'px';
                //重置toy 内容X方向的left值
                for (let j = 0; j < toyContent.childNodes.length; j ++){
                    // console.log(this.setData.toyX);
                    toyContent.style.left = this.setData.toyX + 'px';
                }
            }
            //重置滚动条的top值
            this.refs.InvScroll.style.top =  this.setData.scrollTop+ 'px';
            Y_top = this.setData.scrollTop;
            this.refs.InvScroll_X.style.left = 0;
            //当前项显示
            box_child.childNodes[this.setData.currentSelect].style.display = "block";
        }

        this.data = this.props.getToy.data;
        // console.log(this.data);
        //获取顶部tab名称
        let tab_arr = [];
        for(let i in this.data) {
            tab_arr.push(i);
        }

        //用来保存2级名称
        let vehicle_sort2_name = [];
        let human_sort2_name = [];
        let animal_sort2_name = [];
        let building_sort2_name = [];
        let plant_sort2_name = [];
        let article_sort2_name = [];
        let _this = this;
        //封装分类函数
        let sort = function (name) {
            //二级分类名称
            let sortName = _this.data[name];
            let sortName_arr = [];
            //将二级名称添加进数组
            for(let n in sortName) {
                // console.log(n);
                //n中出现位置函数体 利用typeof 消除影响（下同）
                if(typeof n === 'string'){
                    sortName_arr.push(n);
                }
            }
            let sortName_li = [];
            //设置li标签中的key
            let num = 0;
            for(let q in sortName_arr){
                if(typeof sortName_arr[q] == "string"){
                    sortName_li.push(
                        <li key={num++}>
                            {sortName_arr[q]}
                        </li>
                    );
                }
                //判断之后将名称push进数组内；
                if (name === '交通工具') {
                    if(typeof sortName_arr[q] == "string") {
                        vehicle_sort2_name.push(sortName_arr[q])
                    }
                }
                if (name === '人物') {
                    if(typeof sortName_arr[q] == "string"){
                        human_sort2_name.push(sortName_arr[q])
                    }
                }
                if (name === '动物') {
                    if(typeof sortName_arr[q] == "string"){
                        animal_sort2_name.push(sortName_arr[q])
                    }
                }
                if (name === '建筑') {
                    if(typeof sortName_arr[q] == "string"){
                        building_sort2_name.push(sortName_arr[q])
                    }
                }
                if (name === '植物') {
                    if(typeof sortName_arr[q] == "string"){
                        plant_sort2_name.push(sortName_arr[q])
                    }
                }
                if (name === '物品') {
                    if(typeof sortName_arr[q] == "string"){
                        article_sort2_name.push(sortName_arr[q])
                    }
                }
            }
            return sortName_li;
        };

        //调用函数
        this.vehicle_arr_li = sort('交通工具');
        this.human_arr_li = sort('人物');
        this.animal_arr_li = sort('动物');
        this.building_arr_li = sort('建筑');
        this.plant_arr_li = sort('植物');
        this.article_arr_li = sort('物品');

        //封装函数(用来push toy中单个li进数组)
        let Array = function (toyType,arr) {
            // console.log(toyType.data_list);
            let data_list = toyType.data_list;
            let All_length = Object.keys(data_list).length;

            for(let item in data_list){
                if(typeof data_list[item] === 'object'){
                    if(data_list[item].model_name == "火车" ||
                        data_list[item].model_name == "云霄飞车" ||
                        data_list[item].model_name == "八仙2" ||
                        data_list[item].model_name == "长城"
                    ){
                        continue
                    }
                    // console.log(data_list.length+1);
                    let img = toyType.list_img;
                    //获取鼠标悬浮时的名称
                    let title = data_list[item].model_name;
                    // console.log(toyType.list_img);
                    let style = {
                        backgroundImage: 'url(' + img + ')',
                        backgroundPosition:  -item*60+'px 0',
                        backgroundSize: data_list.length*60 + 'px 60px'
                    };
                    arr.push(
                        <li key={data_list[item].model_id}>
                            <div className="item" name={data_list[item].model_id} style={style} title={title} data-number={item} data-length={All_length}>
                            </div>
                        </li>
                    )
                }
            }
        };

        //设置ul的唯一key值
        let key_num = 0;
        //定义数组接收所有ul的ref值(用来添加自定义属性touch-action)
        this.refArr = [];
        let ForArray = (sort2_name, sort1_name_E, sort1_name) => {
            //用this接收指定类名的ul（如：this.human_arr = []）
            this[sort1_name_E + '_arr'] = [];
            // console.log(this.data[sort1_name]);
            this[sort1_name] = 0;

            //循环遍历二次标题中的每一项
            for(let i = 0 ;i < sort2_name.length; i ++){
                //li的个数最多的ul
                // console.log(sort2_name[i]);
                if(this.data[sort1_name][sort2_name[i]].data_list.length > this[sort1_name]){
                    this[sort1_name] = this.data[sort1_name][sort2_name[i]].data_list.length;
                }

                //定义名称
                let allName = sort1_name_E + (i + 1);
                //定义空数组并添加到this中（用来储存没一条中所有的li标签）
                this[allName] = [];
                //调用Array函数

                this.refArr.push(allName);
                Array(this.data[sort1_name][sort2_name[i]],this[allName]);

                //将Array中获取的所有li追加进ul中，并将ul push进指定数组中
                this[sort1_name_E + '_arr'].push(
                    <ul className="items-line" key={key_num} ref={allName}>
                        {this[allName]}
                    </ul>
                );
                key_num++;
            }
            // console.log(this[sort1_name_E + '_arr']);
        };

        ForArray(vehicle_sort2_name, 'vehicle', '交通工具');
        ForArray(human_sort2_name, 'human', '人物');
        ForArray(animal_sort2_name, 'animal', '动物');
        ForArray(building_sort2_name, 'building', '建筑');
        ForArray(plant_sort2_name, 'plant', '植物');
        ForArray(article_sort2_name, 'article', '物品');

        return(
            <div className="inventory" onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>
                <div className="frame-up"></div>
                <div className="frame-down"></div>
                <div className="frame-left"></div>
                <div className="frame-right"></div>
                <TitleTop refs="titleTop"/>
                <div className="box" ref="box" id="box">
                    <div className="items">
                        <ul className="category" ref="category3">
                            {this.animal_arr_li}
                        </ul>
                        <div ref="itemsLine3" className="itemsLine">
                            {this.animal_arr}
                        </div>
                    </div>
                    <div className="items d_n">
                        <ul className="category" ref="category4">
                            {this.building_arr_li}
                        </ul>
                        <div ref="itemsLine4" className="itemsLine">
                            {this.building_arr}
                        </div>
                    </div>
                    <div className="items d_n">
                        <ul className="category" ref="category1">
                            {this.vehicle_arr_li}
                        </ul>
                        <div ref="itemsLine1" className="itemsLine">
                            {this.vehicle_arr}
                        </div>
                    </div>
                    <div className="items d_n">
                        <ul className="category" ref="category2">
                            {this.human_arr_li}
                        </ul>
                        <div ref="itemsLine2" className="itemsLine">
                            {this.human_arr}
                        </div>
                    </div>
                    <div className="items d_n">
                        <ul className="category" ref="category6">
                            {this.article_arr_li}
                        </ul>
                        <div ref="itemsLine6" className="itemsLine">
                            {this.article_arr}
                        </div>
                    </div>
                    <div className="items d_n">
                        <ul className="category" ref="category5">
                            {this.plant_arr_li}
                        </ul>
                        <div ref="itemsLine5" className="itemsLine">
                            {this.plant_arr}
                            <ul className="items-line">
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="Inv_scroll_bar" ref="InvRullBar">
                    <span className="Inv_scroll"  ref="InvScroll"></span>
                </div>
                <div className="Inv_scroll_bar_X" ref="InvRullBar_X">
                    <span className="Inv_scroll_X"  ref="InvScroll_X" onMouseDown={(event) => this.drawX(event)}></span>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    getToy:state.getToy,
    titleTop:state.titleTop
});

Inventory = connect(mapStateToProps)(Inventory)
export default Inventory