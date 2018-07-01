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
    //用在操作系统的文件系统之中，就是找文件的效率高
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

    var minNode = function (node) {
        if(node){//如果当前节点不是空
            while(node && node.left !== null){//看当前节点有没有左孩子，直到左孩子不存在为止
                node = node.left;//如果有左孩子，则进入左孩子
            }
            return node.key;//没有左孩子，直接返回
        }
        return null;//节点为空，返回null
    }
    //查找最小值
    this.min = function () {
        return minNode(root)
    }

    var maxNode = function (node) {
        if(node){//如果当前节点不是空
            while(node && node.right !== null){//看当前节点有没有右孩子，直到右孩子不存在为止
                node = node.right;//如果有右孩子，则进入右孩子
            }
            return node.key;//没有右孩子，直接返回
        }
        return null;//节点为空，返回null
    }
    //查找最大值
    this.max = function () {
        return maxNode(root)
    }

    var searchNode = function (node, key) {
        if(node == null){//如果当前节点不存在
            return false;//查找失败
        }

        if(key < node.key){//如果不是null,如果要查找的值比当前节点的值小，进入当前节点的左子树
            return searchNode(node.left, key);
        }else if(key > node.key){//如果要查找的值比当前节点的值大，进入当前节点的右子树
            return searchNode(node.right, key);
        }else {//如果当前节点的值和传入的参数的值相等，返回true,表明查找成功
            return true;
        }
    }
    //查找给定的数值
    this.search = function (key) {//key是查找的值
        return searchNode(root, key)
    }

    var findMinNode = function(node){
        if(node){
            while (node && node.left !== null){
                node = node.left;
            }
            return node;
        }
        return null;
    }
    var removeNode = function (node, key) {
        if(node === null){//如果当前节点不存在
            return null;//返回空
        }
        if(key < node.key){//如果当前节点存在，判断如果要删除的值是否小于该节点的值，则进入左子树，递归调用直到找不到左孩子
            node.left = removeNode(node.left, key)
        }else if(key > node.key){//如果要删除的值大于该节点的值，则进入右子树，递归调用，直到找不到右孩子
            node.right = removeNode(node.right, key)
        }else {//如果要删除的值和该节点的值相等
            //1.如果是叶子节点
            if(node.left === null && node.right === null){
                //判断左右节点是不是都不存在，如果不存在则将该节点置成空，返回该节点
                node = null;//将该节点置成空，相当于删除该节点
                return node;
            }
            //2.如果只含有一个子树
            if(node.left === null){//如果当前节点的左子树为空，则表明当前节点只有右子树
                node = node.right;//把当前要删除的节点换成右孩子这个节点
                return node;
            }else if(node.right === null){//如果当前节点的右子树为空，则表明当前节点只有左子树
                node = node.left;//把当前要删除的节点换成左孩子这个节点
                return node;
            }

            //3.如果含有两个子树
            var aux = findMinNode(node.right);//找到右子树最小值节点
            node.key = aux.key;//将要删除的节点的值更新为最小值节点的值
            node.right = removeNode(node.right, aux.key)//将最小节点从当前节点的右子树中进行删除
        }
    }
    //删除某个节点
    this.remove = function (key) {
        root = removeNode(root, key);//首先对根节点进行判断
    }
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
// binaryTree.postOrderTraverse(callback)
// console.log('min node is: ' + binaryTree.min());
// console.log('max node is: ' + binaryTree.max());
// console.log(binaryTree.search(7) ? 'key 7 is found' : 'key 7 is not found');
// console.log(binaryTree.search(9) ? 'key 9 is found' : 'key 9 is not found');
binaryTree.remove(1);//1-叶子节点
binaryTree.remove(10);//10-只含有一个子树
binaryTree.remove(3);//3-含有两个子树
