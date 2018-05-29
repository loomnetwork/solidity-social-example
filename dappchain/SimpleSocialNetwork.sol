pragma solidity ^0.4.24;

contract SimpleSocialNetwork {
    struct Comment {
        string text;
    }

    struct Post {
        string text;
    }

    mapping (address => uint[]) public postsFromAccount;
    mapping (uint => uint[]) public commentsFromPost;
    mapping (uint => address) public commentFromAccount;

    Post[] public posts;
    Comment[] public comments;

    event NewPostAdded(uint postId, address owner, string text);
    event NewCommentAdded(uint postId, uint commentId, address owner, string text);

    function hasPosts() public view returns(bool _hasPosts) {
        _hasPosts = posts.length > 0;
    }

    function newPost(string _text) public {
        Post memory post = Post(_text);
        uint postId = posts.push(post) - 1;
        postsFromAccount[msg.sender].push(postId);
        emit NewPostAdded(postId, msg.sender, _text);
    }

    function newComment(uint _postId, string _text) public {
        Comment memory comment = Comment(_text);
        uint commentId = comments.push(comment) - 1;
        commentsFromPost[_postId].push(commentId);
        commentFromAccount[commentId] = msg.sender;
        emit NewCommentAdded(_postId, commentId, msg.sender, _text);
    }
}
