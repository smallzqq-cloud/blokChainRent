// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interface/Inft.sol";
import "./interface/IhouseItems.sol";
import "./PayTimeCheck.sol";
import "./PwdEncode.sol";
import "./HouseToken.sol";

contract RentManagement is PayTimeCheck,PwdEncode,HouseToken {

    address private landlordItems;
    address private tenantItems;
    address private houseItems;
    address private houseToken;


    struct RoomRentInfo {
        string title;
        uint256 itemId;
        uint256 area;
        uint256 rental;
        uint256 deposit;
        uint256 electricity;
        uint256 hotwater;
        uint256 coldwater;
        uint256 validTime;
        uint256 paymentTime;
        string roomUrl;
    }

    struct RoomContractInfo {
        string title;
        uint256 itemId;
        uint256 area;
        address landlord;
        address tenant;
        uint256 rental;
        uint256 deposit;
        uint256 electricity;
        uint256 hotwater;
        uint256 coldwater;
        uint256 startTime;
        uint256 validTime;
        uint256 paymentTime;
        uint256 endTime;
        string roomUrl;
    }

    struct PwdMsg{
        uint256 itemId;
        address landlord;
        address tenant;
    }

    struct Bill {
        bool[] rentPayStatus;
        uint256 electricityBalance;
        uint256 coldwaterBalance;
        uint256 hotwaterBalance;
    }
    
    struct BadBill{
        address landlord;
        address tenant;
        uint256 rental;
        uint256 itemId;
    }

    enum Gender {
        male,
        female
    }

    struct LandlordInfo {
        string name;
        Gender gender;
        uint256 phone;
        string idCard;
        string cardUrl;
    }

    struct TeantInfo {
        string name;
        Gender gender;
        uint256 phone;
        string idCard;
        string cardUrl;
    }

    RoomRentInfo private DeleteRoomInfos;
    mapping(uint256 => bool) public isRent;
    mapping(uint256 => LandlordInfo) private LandlordById;
    mapping(uint256 => TeantInfo) private TeantById;
    mapping(uint256 => RoomRentInfo) public LandlordHouseItem;
    mapping(uint256 => RoomContractInfo) private ContractInfo;
    RoomContractInfo[] private ContractInfos;
    mapping(uint256 => PwdMsg) private Pwd;
    mapping(uint256 => Bill) private billStatus;
    mapping(address => bool) private blackList;
    mapping(address => BadBill) private blackListInfo;
    mapping(address => uint256[]) private yourRent;
    mapping(address => uint256[]) private landlordRent;
    using SafeERC20 for IERC20;

    constructor(address landlord,address tenant, address house)HouseToken(201000000000000) {
        landlordItems =landlord;
        tenantItems = tenant;
        houseItems = house;
  
    }


    modifier isLandlord {
        require(ERC721(landlordItems).balanceOf(msg.sender)>0,"not Landlord");
        _;
    }
    modifier isTenant {
        require(ERC721(tenantItems).balanceOf(msg.sender)>0,"not Tenant");
        _;
    }
    modifier isBlackTenant {
        require(!blackList[msg.sender],"is black tenant");
        _;
    }
    
    modifier isTokenOwner(uint256 tokenId){
        require(ERC721(houseItems).ownerOf(tokenId)==msg.sender,"not Landlord");
        _;
    }

    function registerLandlord(string memory name,  Gender gender,  uint256 phone, string memory idCard, string memory tokenUrl) public returns (uint256 landlordId) {
        require(msg.sender != address(0), "address is zero");
        require(ERC721(landlordItems).balanceOf(msg.sender) == 0, "is Landlord");
        landlordId = Inft(landlordItems).awardItem(msg.sender,tokenUrl);
        LandlordInfo storage newLandlord = LandlordById[landlordId] ;
        newLandlord.name = name;
        newLandlord.gender = gender;
        newLandlord.phone = phone;
        newLandlord.idCard = idCard;
        newLandlord.cardUrl = tokenUrl;
    }
    
    function registerTenant(string memory name,  Gender gender,  uint256 phone, string memory idCard, string memory tokenUrl) public returns (uint256 tenantId) {
        require(msg.sender != address(0), "address is zero");
        require(ERC721(tenantItems).balanceOf(msg.sender) == 0, "is Tenant");
        tenantId = Inft(tenantItems).awardItem(msg.sender,tokenUrl);
        TeantInfo storage newTeantInfo = TeantById[tenantId] ;
        newTeantInfo.name = name;
        newTeantInfo.gender = gender;
        newTeantInfo.phone = phone;
        newTeantInfo.idCard = idCard;
        newTeantInfo.cardUrl = tokenUrl;
    }

    function getLordInfo(uint256 rid) public view returns(LandlordInfo memory landlordInfo){
        landlordInfo = LandlordById[rid] ;
    }

    function getTeantInfo(uint256 rid) public view returns(TeantInfo memory teantInfo){
        teantInfo = TeantById[rid] ;
    }

    function createItem(RoomRentInfo memory roomRentInfo) public isLandlord returns (bool) {
        uint256 itemId = IhouseItems(houseItems).awardHouseItem(msg.sender);
        LandlordHouseItem[itemId] = roomRentInfo;
        createTranferInfo(roomRentInfo.title, itemId, roomRentInfo.area, msg.sender, roomRentInfo.rental, roomRentInfo.deposit, roomRentInfo.electricity, roomRentInfo.hotwater, roomRentInfo.coldwater, roomRentInfo.validTime, roomRentInfo.paymentTime, roomRentInfo.roomUrl);
        isRent[itemId] = false;
        landlordRent[msg.sender].push(itemId);
        return true;
    }

    function createTranferInfo(string memory title, uint256 itemId, uint256 area, address landlord,uint256 rental, uint256 deposit,uint256 electricity,uint256 hotwater,uint256 coldwater,uint256 validTime, uint256 paymentTime, string memory roomUrl) private {
        RoomContractInfo storage info = ContractInfo[itemId];
        info.title = title;
        info.itemId = itemId;
        info.area = area;
        info.landlord = landlord;
        info.rental = rental;
        info.deposit = deposit;
        info.electricity = electricity;
        info.hotwater = hotwater;
        info.coldwater = coldwater;
        info.validTime = validTime;
        info.paymentTime = paymentTime;
        info.tenant = address(0);
        info.roomUrl = roomUrl;
        ContractInfos.push(info);
    }

    function getItemsContractInfo() public view returns (RoomContractInfo[] memory) {
        return ContractInfos;
    }
    
       function getItemsContractInfoById(uint256 itemId) public view returns (RoomContractInfo memory) {
        return ContractInfo[itemId];
    }

    function itemUpdate(uint256 itemId,RoomRentInfo memory roomRentInfo) public isLandlord isTokenOwner(itemId) {
        RoomRentInfo storage itemInfo = LandlordHouseItem[itemId];
        itemInfo.title = roomRentInfo.title;
        itemInfo.itemId = roomRentInfo.itemId;
        itemInfo.area = roomRentInfo.area;
        itemInfo.rental = roomRentInfo.rental;
        itemInfo.deposit = roomRentInfo.deposit;
        itemInfo.electricity = roomRentInfo.electricity;
        itemInfo.hotwater = roomRentInfo.hotwater;
        itemInfo.coldwater = roomRentInfo.coldwater;
        itemInfo.paymentTime = roomRentInfo.paymentTime;
        itemInfo.validTime = roomRentInfo.validTime;
    }

    function cancleItems(uint256 itemId) public isLandlord isTokenOwner(itemId) {
        IhouseItems(houseItems).CancleItem(itemId);
    }
   
    function getItemsById(uint256 itemId) public view returns (RoomRentInfo memory ItemsInfo) {
            ItemsInfo =  LandlordHouseItem[itemId];
            return ItemsInfo;
    }

    function getYourRent(address teant) public view returns(uint256[] memory) {
        require(msg.sender == teant, "u just can check yoursekf");
        return yourRent[teant];
    }

    function getLandlordRent(address landlord) public view returns(uint256[] memory) {
        require(msg.sender == landlord, "u just can check yoursekf");
        return landlordRent[landlord];
    }

    function rentHouse(uint256 itemId) public isTenant isBlackTenant returns(bool) {
            RoomContractInfo storage info = ContractInfo[itemId];
            require(info.tenant == address(0), "room is rented");
            require(info.landlord != msg.sender, "u are landlord");
            uint256 payamount = info.rental+info.deposit;
            transfer(info.landlord, payamount);
            info.tenant = msg.sender;
            info.startTime = block.timestamp;
            info.endTime = block.timestamp+info.validTime;
            ContractInfo[itemId]=info;
            Bill storage payInfo = billStatus[itemId];
            isRent[itemId] = true;
            uint256 paylength = getAllPayTime(info.validTime,info.paymentTime);
            payInfo.rentPayStatus = new bool[](paylength);
            payInfo.rentPayStatus[0]=(true);
            yourRent[msg.sender].push(itemId);
            return true;
    }

    function payRent(uint256 itemId) public returns(bool paystatus) {
        RoomContractInfo memory info = ContractInfo[itemId];
        require(info.tenant!=address(0),"room not rented");
        Bill storage payInfo = billStatus[itemId];
        uint256 paylength = getAllPayTime(info.validTime,info.paymentTime);
        require(!payInfo.rentPayStatus[paylength-1],"rental was pay in full");
                transfer(info.landlord, info.rental);
                for (uint i = 0; i < payInfo.rentPayStatus.length; i++) {
                    if (!payInfo.rentPayStatus[i]) {
                        payInfo.rentPayStatus[i] = true;
                        billStatus[itemId]=payInfo;
                        paystatus = true;
                        return paystatus;
                    }
                }
    }

    function payElectricity(uint256 itemId, uint256 electricity) public returns (bool) {
        RoomContractInfo memory info = ContractInfo[itemId];
        require(info.tenant!=address(0),"room not rented");
        Bill memory payInfo =billStatus[itemId];
        payInfo.electricityBalance +=electricity;
        billStatus[itemId]=payInfo;
        return true;
    }

    function payHotWaterFee(uint256 itemId, uint256 hotwater) public returns (bool) {
        RoomContractInfo memory info = ContractInfo[itemId];
        require(info.tenant!=address(0),"room not rented");
        Bill memory payInfo = billStatus[itemId];
        payInfo.hotwaterBalance += hotwater;
        billStatus[itemId]=payInfo;
        return true;
    }

    function payColdWaterFee(uint256 itemId, uint256 coldwater) public returns (bool) {
        RoomContractInfo memory info = ContractInfo[itemId];
        require(info.tenant!=address(0),"room not rented");
        Bill memory payInfo = billStatus[itemId];
        payInfo.coldwaterBalance += coldwater;
        billStatus[itemId]=payInfo;
        return true;
    }

    function getPayStatu(uint256 itemId) public view returns (bool payStatu) {     
        RoomContractInfo memory contractInfo = ContractInfo[itemId];
        require(contractInfo.endTime>block.timestamp,"time");
        uint256 payTime = getPayTime(contractInfo.startTime,contractInfo.paymentTime);
        Bill memory BillInfo = billStatus[itemId];
        bool[] memory payStatus = BillInfo.rentPayStatus;
        payStatu =payStatus[payTime];
    }

    function getBillInfo(uint256 itemId) public view  returns (Bill memory BillInfo) {
        require(ERC721(landlordItems).ownerOf(itemId) == msg.sender||Pwd[itemId].tenant == msg.sender,"not tenant or landlord");
        BillInfo = billStatus[itemId];
    }


   function removeHouse(uint256 itemId) public returns(bool) {
    require(!isRent[itemId],"room is rent");
    RoomContractInfo memory contractInfo = ContractInfo[itemId];
    require(contractInfo.landlord == msg.sender, "not landlord");
    uint256[] storage array = landlordRent[msg.sender];
    removeContractInfo(itemId);
    for (uint i = 0; i < array.length; i++) {
        if (array[i] == itemId) {
            if (i < array.length - 1) {
                array[i] = array[array.length - 1];
            }
            array.pop();
            return true;
        }
    }
    return false;
}

    function removeContractInfo(uint256 itemId) private returns(bool) {
    for (uint i = 0; i < ContractInfos.length; i++) {
        if (ContractInfos[i].itemId == itemId) {
            if (i < ContractInfos.length - 1) {
                ContractInfos[i] = ContractInfos[ContractInfos.length - 1];
            }
            ContractInfos.pop();
            return true;
        }
    }
    return false;
}


    function addBlackList(uint256 itemId, address landlord, address tenant, uint256 rental) private returns (bool doorStatu) {
        blackList[tenant] = true;
        BadBill storage Badinfo = blackListInfo[tenant];
        Badinfo.itemId = itemId;
        Badinfo.landlord = landlord;
        Badinfo.tenant = tenant;
        Badinfo.rental = rental;
        return blackList[tenant];
        
    }

    function removeBlackList(address Blacktenant) public returns (bool) {
        require(blackList[Blacktenant],"not black tenant");
        payBadRental(Blacktenant);
        blackList[Blacktenant]=false;
        delete blackListInfo[Blacktenant];
        return blackList[Blacktenant];
    }
    
    function payBadRental(address Blacktneant) private  {
        BadBill memory Badinfo = blackListInfo[Blacktneant];
        IERC20(houseToken).safeTransfer(Badinfo.landlord,Badinfo.rental);
    }

//     function removeElementFromArray(uint elementToRemove, uint[] storage arrayToModify) public {
//     for(uint i = 0; i < arrayToModify.length; i++){
//         if(arrayToModify[i] == elementToRemove){
//             // Shift elements to the left
//             for(uint j = i; j < arrayToModify.length-1; j++){
//                 arrayToModify[j] = arrayToModify[j+1];
//             }
//             // Delete last element
//             arrayToModify.pop();
//             break;
//         }
//     }
// }


}