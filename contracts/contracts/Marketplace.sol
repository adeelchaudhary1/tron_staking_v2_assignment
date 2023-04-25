// SPDX-License-Identifier: GPL-3.0

// In this smart contract we have covered only one side for p2p orders which is from lender perspective.
// Lender will come and place order by freezing his trx and then any borrower came to accept his order.


pragma solidity ^0.8.18;

/**
 * @title Counters
 * @author Matt Condon (@shrugs)
 * @dev Provides counters that can only be incremented, decremented or reset. This can be used e.g. to track the number
 * of elements in a mapping, issuing ERC721 ids, or counting request ids.
 *
 * Include with `using Counters for Counters.Counter;`
 */
library Counters {
    struct Counter {
        // This variable should never be directly accessed by users of the library: interactions must be restricted to
        // the library's function. As of Solidity v0.5.2, this cannot be enforced, though there is a proposal to add
        // this feature: see https://github.com/ethereum/solidity/issues/4637
        uint256 _value; // default: 0
    }

    function current(Counter storage counter) internal view returns (uint256) {
        return counter._value;
    }

    function increment(Counter storage counter) internal {
        unchecked {
            counter._value += 1;
        }
    }

    function decrement(Counter storage counter) internal {
        uint256 value = counter._value;
        require(value > 0, "Counter: decrement overflow");
        unchecked {
            counter._value = value - 1;
        }
    }

    function reset(Counter storage counter) internal {
        counter._value = 0;
    }
}

contract EnergyDelegationMarketPlace {

    using Counters for Counters.Counter;
    Counters.Counter private _orderIds;

    // ResourceType for freeze unfreeze or delegate and undelegate.
    enum ResourceType{ BANDWIDTH, ENERGY }

    enum OrderStatus { OPEN, COMPLETED, RENTED, CANCELED, ABORTED }

    // For Now we will be hardcoding to support only trx as mod of payment.
    struct Order {
        uint256 orderId;
        address payable lender;
        address borrower;
        OrderStatus status;
        uint256 rent; // trx amount rent asked by lender or offered by borrower.
        uint256 staked; // will save how many trx we will be staking or delegated for other resource.

    }

    mapping(uint256 => Order) _orders;

    // Events
    event OrderPlaced(uint256 orderId);
    event CanceledOrder(uint256 orderId);
    event OrderRented(uint256 orderId);
    event Unfreeze(uint256 orderId);

    /**
     * This function will be called by lender so that they should offer their availble trx for staking and get some rent.
     */
    function addOrder(uint256 rentAmount) external payable {
        _orderIds.increment();
        uint256 currentOrderId = _orderIds.current();


        Order storage order = _orders[currentOrderId];
        require(order.lender == address(0), "Invalid Order Id");
        order.orderId = currentOrderId;
        order.lender = payable(msg.sender);
        order.status = OrderStatus.OPEN;
        order.rent = rentAmount;
        order.staked = msg.value;

        emit OrderPlaced(currentOrderId);

    } // end of function


    /**
     * In case user want to cancel his listing item.
     */
    function cancelOrder(uint256 orderId) external {
        Order storage order = _orders[orderId];
        require(order.lender == msg.sender, "You are not lender of this order");
        require(order.status == OrderStatus.OPEN, "Order is not opened");
        order.status = OrderStatus.CANCELED;
        order.lender.transfer(order.staked);
        emit CanceledOrder(orderId);
    }


    /**
     * Accept Offer by borrower
     */
    function acceptOffer(uint256 orderId) external payable {
        Order storage order = _orders[orderId];
        require(order.lender != address(0), "Invalid Order Id");
        require(msg.value == order.rent, "Invalid rent amount");
        require(order.status == OrderStatus.OPEN, "Order is not opened");
        require(order.rent <= msg.value, "Rent amount is less then transfered to contract");
        freezebalancev2(order.staked, uint(ResourceType.ENERGY));
        payable(order.borrower).delegateResource(order.staked, uint(ResourceType.ENERGY));
        payable(order.lender).transfer(order.rent);
        order.status = OrderStatus.RENTED;
        emit OrderRented(orderId);
    }

        /**
     * In case user want to cancel his listing item.
     */
    function unfreezeStaked(uint256 orderId) external {
        Order storage order = _orders[orderId];
        require(order.lender == msg.sender, "You are not lender of this order");
        order.status = OrderStatus.ABORTED;
        unfreezebalancev2(1000000, uint(ResourceType.ENERGY));

        order.lender.transfer(order.staked);
        emit Unfreeze(orderId);
    }
}