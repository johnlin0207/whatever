//数据模型
class JL {
    constructor(obj) {
        const {data, onMounted, ...other} = obj;
        //内部维护的data
        this.data = data;
        //dom数组
        this.domArr = [];
        this._innerData = {
            construction: ['j-text', 'j-modal', 'j-for'],
            bindingVariable2domActionMapping: {} //{'name': [function(){}]}
        };

        //初始化数据
        if (data) {
            for (let i in data) {
                if (data.hasOwnProperty(i)) {
                    this[i] = data[i];
                    //双向绑定
                    Object.defineProperty(this.data, i, {
                        configurable: true,
                        enumerable: true,
                        get: () => {
                            return this[i]
                        },
                        set: (value) => {
                            this[i] = value;
                            if (Array.isArray(this._innerData.bindingVariable2domActionMapping[i])) {
                                //V->M
                                this._innerData.bindingVariable2domActionMapping[i].forEach((fn) => {
                                    fn()
                                })
                            }
                        }
                    });
                }
            }
        }

        //初始化生命周期
        this.onMounted = onMounted || function () {
        };

        //初始化其他属性方法
        for (let i in other) {
            if (other.hasOwnProperty(i)) {
                this[i] = other[i]
            }
        }

        //页面加载完成, 开始绑定数据
        $(() => {
            //初始化绑定
            this.bindingData();
            //初始化数据
            for (let i in data) {
                if (data.hasOwnProperty(i)) {
                    this.data[i] = data[i];
                }
            }
            //绑定完毕, 调用mounted生命周期
            this.onMounted()
        })
    }

    //根据指令绑定相关数据
    bindingData() {
        this.findAllBodyDom();
    }

    findAllBodyDom() {
        const body = document.getElementsByTagName('body')[0];
        //取出body中的所有除script之外的dom元素
        this.recursion(body);
        //再依次做绑定
        for (let i of this.domArr) {
            this.matchConstruction(i)
        }
    }

    matchConstruction(dom) {
        this._innerData.construction.forEach((construction) => {
            if (dom.outerHTML.match(construction) !== null) {
                this.handleConstruction(dom, construction)
            }
        })
    }

    //处理指令
    handleConstruction(dom, cons) {
        switch (cons) {
            case 'j-text':
                let bindingTextVariableName = dom.outerHTML.match(/j-text=["'](\w+)["']/)[1];
                if (!this[bindingTextVariableName]) {
                    throw TypeError(`${bindingTextVariableName} using without define, at ${dom}`)
                } else {
                    let thisVariableActionFn = this._innerData.bindingVariable2domActionMapping[bindingTextVariableName];
                    if (!thisVariableActionFn) {
                        this._innerData.bindingVariable2domActionMapping[bindingTextVariableName] = [];
                        this.handleSettingText(dom, bindingTextVariableName);
                    } else {
                        this.handleSettingText(dom, bindingTextVariableName);
                    }
                }
                break;
            case 'j-modal':
                let bindingModalVariableName = dom.outerHTML.match(/j-modal=["'](\w+)["']/)[1];
                if (!this[bindingModalVariableName]) {
                    throw TypeError(`${bindingModalVariableName} using without define,you need define it in data firstly,at ${dom}`)
                } else {
                    //初始化数据
                    let thisVariableActionFn = this._innerData.bindingVariable2domActionMapping[bindingModalVariableName];
                    if (!thisVariableActionFn) {
                        this._innerData.bindingVariable2domActionMapping[bindingModalVariableName] = [];
                        this.handleSettingValue(dom, bindingModalVariableName);
                    } else {
                        this.handleSettingValue(dom, bindingModalVariableName);
                    }
                    //绑定V->M
                    $(dom).on('input', (e) => {
                        this.data[bindingModalVariableName] = e.target.value
                    })
                }
                break;
            case 'j-for':
                let bindingForVariableName = dom.outerHTML.match(/j-for=["'](\w+\s\w+\s\w+)["']/)[1];
                let arrName = bindingForVariableName.match(/^\w+\s\w+\s(\w+)$/)[1];
                let iName = bindingForVariableName.match(/^(\w+)\s\w+\s\w+$/)[1];
                this.handleFor(dom, iName, arrName);
                break;
        }
    }

    //j-text
    handleSettingText(dom, bindingTextVariableName) {
        const domTextAction = () => {
            $(dom).text(this[bindingTextVariableName])
        };
        this._innerData.bindingVariable2domActionMapping[bindingTextVariableName].push(domTextAction)
    }

    //j-modal
    handleSettingValue(dom, bindingModalVariableName) {
        const domValAction = () => {
            //更新input的输入值,input完全受控
            $(dom).val(this[bindingModalVariableName]);
        };
        this._innerData.bindingVariable2domActionMapping[bindingModalVariableName].push(domValAction)
    }

    //j-for
    handleFor(dom, iName, arrName){
        console.log(dom, iName, arrName);
        const domForAction = () => {
            //暂时没有diff功能，重新渲染j-for的dom


        };
        this._innerData.bindingVariable2domActionMapping[arrName].push(domForAction)

    }

    //递归算法
    recursion(parent) {
        if (parent.children.length > 0) {
            const ch = parent.children;
            for (let i of ch) {
                if (i.children.length > 0) {
                    this.recursion(i)
                } else if (i.nodeName !== 'SCRIPT') {
                    this.domArr.push(i)
                }
            }
        }
    }
}

JL.App = (function () {
    let instance;
    return function (obj) {
        if (!instance) {
            instance = new JL(obj)
        }
        return instance
    }
})();

const App = JL.App;


