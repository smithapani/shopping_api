function canViewItem(user, item){
    return(
        user.role == 'admin' || (item.userId).equals(user._id) 
        
    )
}

function scopedItem(user,items){

    if(user.role == "admin"){
        return items
    }

    return items.filter((item) => (item.userId).equals(user._id));
}

function canDelete(user,item){

    console.log("item.userId",item.userId);
    console.log("user._id",user._id);
    return (item.userId).equals(user._id)
}

module.exports = {
    canViewItem, scopedItem, canDelete
}

