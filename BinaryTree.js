//二叉排序树
function BinaryTree(){
    //定义节点
    var Node = function(key){
        //值
        this.key = key;
        //左箭头
        this.left = null;
        //右箭头
        this.right = null;
    };
    //根节点
    var root = null;
    //insertNode方法，用来判断插入节点的位置
    var insertNode = function (node, newNode) {
        if(newNode.key < node.key){//若新节点的值小于老节点的值，判断左子树
            if(node.left === null){//如果老节点的左孩子为空，则插入新节点
                node.left = newNode;
            }else{//如果不为空
                insertNode(node.left, newNode)
            }
        }else{//若新节点的值大于老节点的值，判断右子树
            if(node.right === null){
                node.right = newNode;
            }else{
                insertNode(node.right, newNode)
            }
        }
    };
    //插入节点
    this.insert = function (key) {
        //构造节点对象
        var newNode = new Node(key);
        //如果根节点为空则插入
        if(root === null){
            root = newNode;
        }else {//如果根节点不为空，调用insertNode方法
            insertNode(root, newNode)
        }
    }

    //中序遍历 callback作用：当我们要输出某一个节点的值的时候，将这个值传入回掉函数中，让函数决定好怎么输出
    var inOrderTraverseNode = function (node, callback) {
        if(node !== null){//如果当前节点不为空，先访问左子树
            inOrderTraverseNode(node.left, callback);
            //访问完左子树，打印节点的值
            callback(node.key);
            //访问完当前节点，访问右子树
            inOrderTraverseNode(node.right, callback);
        }

    };
    //结果相当于按照升序的方式进行打印
    this.inOrderTraverse = function (callback) {
        inOrderTraverseNode(root, callback)
    }


    //前序遍历
    var preOrderTraverseNode = function (node, callback) {
        if(node !== null){//如果当前节点不为空，先打印节点的值
            callback(node.key);
            //访问完节点，访问当前节点的左子树
            preOrderTraverseNode(node.left, callback);
            //访问完左子树，访问右子树
            preOrderTraverseNode(node.right, callback);
        }
    };
    //结果相当于打印一个二叉树
    this.preOrderTraverse = function (callback) {
        preOrderTraverseNode(root, callback)
    }

    var postOrderTraverseNode = function (node, callback) {
        if (node !== null){//如果当前节点不为空，先打印节点的值
            //先访问左子树
            postOrderTraverseNode(node.left, callback);
            //然后访问右子树
            postOrderTraverseNode(node.right, callback);
            //最后打印根节点的值
            callback(node.key)
        }
    }
    //后序遍历
    this.postOrderTraverse = function (callback) {
        postOrderTraverseNode(root, callback)
    }
    //用在操作系统的文件系统之中，就是找文件的效率高
}
var nodes = [8, 3, 10, 1, 6, 14, 4, 7, 13];
var binaryTree = new BinaryTree();
nodes.forEach(key => {
    binaryTree.insert(key)
});

var callback = function (key) {
    // document.write(key + '<br/>');
    console.log(key)
};
// binaryTree.inOrderTraverse(callback)
// binaryTree.preOrderTraverse(callback)
binaryTree.postOrderTraverse(callback)