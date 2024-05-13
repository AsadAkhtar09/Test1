//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {

    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);


    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}


contract TestToken is IERC20 {

    string public constant name = "TestToken";
    string public constant symbol = "TST";
    uint8 public constant decimals = 18;


    mapping(address => uint256) balances;

    mapping(address => mapping (address => uint256)) allowed;

    uint256 public _totalSupply = 10 ether;


   constructor() {
    balances[msg.sender] = _totalSupply;
    }

    function totalSupply() public override view returns (uint256) {
    return _totalSupply;
    }

    function balanceOf(address tokenOwner) public override view returns (uint256) {
        return balances[tokenOwner];
    }

    function transfer(address receiver, uint256 numTokens) public override returns (bool) {
        require(receiver != address(0), "Transfer to zero address");
        require(numTokens <= balances[msg.sender], "Insufficient balance");
        balances[msg.sender] -= numTokens;
        balances[receiver] += numTokens;
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }

    function approve(address delegate, uint256 numTokens) public override returns (bool) {
        allowed[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }

    function allowance(address owner, address delegate) public override view returns (uint) {
        return allowed[owner][delegate];
    }

    function transferFrom(address owner, address buyer, uint256 numTokens) public override returns (bool) {
        require(owner != address(0), "Transfer from zero address");
        require(buyer != address(0), "Transfer to zero address");
        require(numTokens <= balances[owner], "Insufficient balance");
        require(numTokens <= allowed[owner][msg.sender], "Insufficient allowance");
        balances[owner] -= numTokens;
        allowed[owner][msg.sender] -= numTokens;
        balances[buyer] += numTokens;
        emit Transfer(owner, buyer, numTokens);
        return true;
    }

    function mint(uint256 amount) public  {
        require(amount > 0, "Amount should be greater than 0");
        require(msg.sender != address(0), "Mint to zero address");
        _totalSupply += amount;
        balances[msg.sender] += amount;
    }

    function burn(uint256 amount) public {
        require(amount > 0, "Amount should be greater than 0");
        require(amount <= balances[msg.sender], "Insufficient balance to burn");
        require(msg.sender != address(0), "zero address not allowed");
        _totalSupply -= amount;
        balances[msg.sender] -= amount;
    }
}