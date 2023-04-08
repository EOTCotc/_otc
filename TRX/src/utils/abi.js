//const contractAddress = "0x68b6d1787a77c0098365760988fdd5a992b7c278";
//const contractAbi = [{ "constant": false, "inputs": [{ "name": "amount", "type": "uint256" }], "name": "transferIn1", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "hx", "type": "string" }, { "name": "orderID", "type": "string" }, { "name": "amount", "type": "uint256" }], "name": "transferOut", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "orderID", "type": "string" }], "name": "getInfokey", "outputs": [{ "name": "", "type": "bytes32" }, { "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "amount", "type": "uint256" }, { "name": "orderID", "type": "string" }, { "name": "hx", "type": "bytes32" }], "name": "transferIn", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "myaddress", "type": "address" }, { "name": "amount", "type": "uint256" }, { "name": "key", "type": "string" }], "name": "transferOut1", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "myaddress", "type": "address" }, { "name": "_eth", "type": "uint256" }, { "name": "key", "type": "string" }], "name": "withdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "buyKey", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [{ "name": "hx", "type": "string" }, { "name": "orderID", "type": "string" }, { "name": "amount", "type": "uint256" }, { "name": "orderads", "type": "address" }], "name": "transferOutfor", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }];
//const contractAddress_usdt = "0xdac17f958d2ee523a2206206994597c13d831ec7";
//const contractAbi_usdt = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_upgradedAddress", "type": "address" }], "name": "deprecate", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "deprecated", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_evilUser", "type": "address" }], "name": "addBlackList", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "upgradedAddress", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balances", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "maximumFee", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "_totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "unpause", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_maker", "type": "address" }], "name": "getBlackListStatus", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "address" }], "name": "allowed", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "paused", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "who", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "pause", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getOwner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "newBasisPoints", "type": "uint256" }, { "name": "newMaxFee", "type": "uint256" }], "name": "setParams", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "amount", "type": "uint256" }], "name": "issue", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "amount", "type": "uint256" }], "name": "redeem", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "remaining", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "basisPointsRate", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "isBlackListed", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_clearedUser", "type": "address" }], "name": "removeBlackList", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "MAX_UINT", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_blackListedUser", "type": "address" }], "name": "destroyBlackFunds", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "name": "_initialSupply", "type": "uint256" }, { "name": "_name", "type": "string" }, { "name": "_symbol", "type": "string" }, { "name": "_decimals", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "amount", "type": "uint256" }], "name": "Issue", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "amount", "type": "uint256" }], "name": "Redeem", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "newAddress", "type": "address" }], "name": "Deprecate", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "feeBasisPoints", "type": "uint256" }, { "indexed": false, "name": "maxFee", "type": "uint256" }], "name": "Params", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "_blackListedUser", "type": "address" }, { "indexed": false, "name": "_balance", "type": "uint256" }], "name": "DestroyedBlackFunds", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "_user", "type": "address" }], "name": "AddedBlackList", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "_user", "type": "address" }], "name": "RemovedBlackList", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [], "name": "Pause", "type": "event" }, { "anonymous": false, "inputs": [], "name": "Unpause", "type": "event" }];

//测试 合约地址
//测试 Usdt 地址
//测试 etoc 地址

//TH4oq291NoktCN345uxdBHd9YakAwG49H3
// TJ2ijtG2xfaEhrLrU81h742bPfcHL4CL1w
//TEt19qEdJM2sPBxLB5XmJGWijT6UvFbs1K

// 测试网
// export const contractAddress = 'TH4oq291NoktCN345uxdBHd9YakAwG49H3'

// export const contractAddress_usdt = 'TJ2ijtG2xfaEhrLrU81h742bPfcHL4CL1w'

// export const contractAddress_eotc = 'TEt19qEdJM2sPBxLB5XmJGWijT6UvFbs1K'
//主网
export const contractAddress = 'TBpcQXdZEX8vYqf2M2CQrHsGt9KZpAEVqu';
export const contractAddress_usdt = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
export const contractAddress_eotc = 'TWP9nhCPWPa6Wr1wSgNY228jGgZ3vzjw4u';

// export  const contractAddress = "TBpcQXdZEX8vYqf2M2CQrHsGt9KZpAEVqu"; // //TPgtc8FyaBofk9W9AvuxBEmyiefEx1Js7e//TMEg1XJyNMKZ8xdPLydLkMkGZzgMFyX2jN
// export  const contractAbi=[{ "constant": false, "inputs": [{ "name": "amount", "type": "uint256" }, { "name": "orderID", "type": "string" }, { "name": "hx", "type": "bytes32" }, { "name": "_tokenAddress", "type": "address" }], "name": "transferIn", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "hx", "type": "string" }, { "name": "orderID", "type": "string" }, { "name": "amount", "type": "uint256" }, { "name": "_tokenAddress", "type": "address" }], "name": "transferOut", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "myaddress", "type": "address" }, { "name": "amount", "type": "uint256" }, { "name": "key", "type": "string" }, { "name": "_tokenAddress", "type": "address" }], "name": "transferOut1", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "convertFromBase58TronAddress", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "amount", "type": "uint256" }, { "name": "_tokenAddress", "type": "address" }], "name": "transferIn1", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "orderID", "type": "string" }], "name": "getInfokey", "outputs": [{ "name": "", "type": "bytes32" }, { "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "hx", "type": "string" }, { "name": "orderID", "type": "string" }, { "name": "amount", "type": "uint256" }, { "name": "orderads", "type": "address" }, { "name": "_tokenAddress", "type": "address" }], "name": "transferOutfor", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "myaddress", "type": "address" }, { "name": "_eth", "type": "uint256" }, { "name": "key", "type": "string" }], "name": "withdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }];
// export const contractAddress_usdt = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";//TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
export const contractAbi_usdt = [
	{
		constant: true,
		inputs: [],
		name: 'name',
		outputs: [{ name: '', type: 'string' }],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: false,
		inputs: [{ name: '_upgradedAddress', type: 'address' }],
		name: 'deprecate',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{ name: '_spender', type: 'address' },
			{ name: '_value', type: 'uint256' }
		],
		name: 'approve',
		outputs: [{ name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'deprecated',
		outputs: [{ name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: false,
		inputs: [{ name: '_evilUser', type: 'address' }],
		name: 'addBlackList',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'totalSupply',
		outputs: [{ name: '', type: 'uint256' }],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{ name: '_from', type: 'address' },
			{ name: '_to', type: 'address' },
			{ name: '_value', type: 'uint256' }
		],
		name: 'transferFrom',
		outputs: [{ name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'upgradedAddress',
		outputs: [{ name: '', type: 'address' }],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'decimals',
		outputs: [{ name: '', type: 'uint8' }],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'maximumFee',
		outputs: [{ name: '', type: 'uint256' }],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: '_totalSupply',
		outputs: [{ name: '', type: 'uint256' }],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: false,
		inputs: [],
		name: 'unpause',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: true,
		inputs: [{ name: '_maker', type: 'address' }],
		name: 'getBlackListStatus',
		outputs: [{ name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'paused',
		outputs: [{ name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{ name: '_spender', type: 'address' },
			{ name: '_subtractedValue', type: 'uint256' }
		],
		name: 'decreaseApproval',
		outputs: [{ name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: true,
		inputs: [{ name: 'who', type: 'address' }],
		name: 'balanceOf',
		outputs: [{ name: '', type: 'uint256' }],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [{ name: '_value', type: 'uint256' }],
		name: 'calcFee',
		outputs: [{ name: '', type: 'uint256' }],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: false,
		inputs: [],
		name: 'pause',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'owner',
		outputs: [{ name: '', type: 'address' }],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'symbol',
		outputs: [{ name: '', type: 'string' }],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{ name: '_to', type: 'address' },
			{ name: '_value', type: 'uint256' }
		],
		name: 'transfer',
		outputs: [{ name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: true,
		inputs: [{ name: 'who', type: 'address' }],
		name: 'oldBalanceOf',
		outputs: [{ name: '', type: 'uint256' }],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{ name: 'newBasisPoints', type: 'uint256' },
			{ name: 'newMaxFee', type: 'uint256' }
		],
		name: 'setParams',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: false,
		inputs: [{ name: 'amount', type: 'uint256' }],
		name: 'issue',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{ name: '_spender', type: 'address' },
			{ name: '_addedValue', type: 'uint256' }
		],
		name: 'increaseApproval',
		outputs: [{ name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: false,
		inputs: [{ name: 'amount', type: 'uint256' }],
		name: 'redeem',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{ name: '_owner', type: 'address' },
			{ name: '_spender', type: 'address' }
		],
		name: 'allowance',
		outputs: [{ name: 'remaining', type: 'uint256' }],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'basisPointsRate',
		outputs: [{ name: '', type: 'uint256' }],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [{ name: '', type: 'address' }],
		name: 'isBlackListed',
		outputs: [{ name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: false,
		inputs: [{ name: '_clearedUser', type: 'address' }],
		name: 'removeBlackList',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'MAX_UINT',
		outputs: [{ name: '', type: 'uint256' }],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: false,
		inputs: [{ name: 'newOwner', type: 'address' }],
		name: 'transferOwnership',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: false,
		inputs: [{ name: '_blackListedUser', type: 'address' }],
		name: 'destroyBlackFunds',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{ name: '_initialSupply', type: 'uint256' },
			{ name: '_name', type: 'string' },
			{ name: '_symbol', type: 'string' },
			{ name: '_decimals', type: 'uint8' }
		],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'constructor'
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, name: '_blackListedUser', type: 'address' },
			{ indexed: false, name: '_balance', type: 'uint256' }
		],
		name: 'DestroyedBlackFunds',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [{ indexed: false, name: 'amount', type: 'uint256' }],
		name: 'Issue',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [{ indexed: false, name: 'amount', type: 'uint256' }],
		name: 'Redeem',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [{ indexed: false, name: 'newAddress', type: 'address' }],
		name: 'Deprecate',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [{ indexed: true, name: '_user', type: 'address' }],
		name: 'AddedBlackList',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [{ indexed: true, name: '_user', type: 'address' }],
		name: 'RemovedBlackList',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: false, name: 'feeBasisPoints', type: 'uint256' },
			{ indexed: false, name: 'maxFee', type: 'uint256' }
		],
		name: 'Params',
		type: 'event'
	},
	{ anonymous: false, inputs: [], name: 'Pause', type: 'event' },
	{ anonymous: false, inputs: [], name: 'Unpause', type: 'event' },
	{
		anonymous: false,
		inputs: [
			{ indexed: true, name: 'previousOwner', type: 'address' },
			{ indexed: true, name: 'newOwner', type: 'address' }
		],
		name: 'OwnershipTransferred',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, name: 'owner', type: 'address' },
			{ indexed: true, name: 'spender', type: 'address' },
			{ indexed: false, name: 'value', type: 'uint256' }
		],
		name: 'Approval',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, name: 'from', type: 'address' },
			{ indexed: true, name: 'to', type: 'address' },
			{ indexed: false, name: 'value', type: 'uint256' }
		],
		name: 'Transfer',
		type: 'event'
	}
];
// export const contractAddress_eotc = "TWP9nhCPWPa6Wr1wSgNY228jGgZ3vzjw4u";//TWP9nhCPWPa6Wr1wSgNY228jGgZ3vzjw4u

// export const Contract_EOTC = async function Contract_EOTC(web3c) {
//   return await web3c.contract.at(contractAddress);
// };
// export const Contract_USDT = async function Contract_USDT(web3c) {
//   return await web3c.contract.at(contractAddress_usdt);
// };
