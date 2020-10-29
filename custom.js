function createDialog(b, a) {
    var c = a ? $("#rootDiv" + a.primeKey) : $("#rootDiv");
    a || (a = {
        primeKey: 1
    });
    if (!$("#alertBox" + a.primeKey).length) {
        var d = $("<div>");
        d.prop({
            id: "alertBox" + a.primeKey
        });
        d.css({
            left: -1,
            top: -1,
            width: c.width() + 10,
            height: c.height() + 10,
            backgroundImage: "url(" + protocolRef + "//dcqhpema7gk9a.cloudfront.net/IND/HTML5/transparent.png)",
            position: "absolute",
            zIndex: 3E3
        });
        c.append(d);
        var e = $("<div>");
        e.prop({
            id: "alertBoxContent" + a.primeKey,
            align: "center"
        });
        e.css({
            width: 300,
            backgroundColor: "#eeeeee",
            borderTopWidth: 25,
            position: "absolute"
        });
        e.html("<br><b>" + b + "</b><br><br><br><input type='button' value='   OK   ' onclick='hideDialog(this)'/><br>&nbsp;");
        d.append(e);
        e.css({
            left: Math.round((c.width() - e.width()) / 2),
            top: Math.round((c.height() - e.height() - 25) / 2)
        });
        $(e).addClass("borderClass shadowClass")
    }
}

function hideDialog(b) {
    b.length ? b.remove() : $(b).parents("[id^=alertBox]").remove()
}

$.fn.customDDPlugin = function(SPObj)
{	
	var _obj = 
	{
		nextBRef: ($("#forwardbutton").length)? "#forwardbutton" : ($("#nextButton").length)? "#nextButton" : "#btn_continue",
		primeKey: (isNaN(this.prop("id").charAt(this.prop("id").length - 1)))? "_" : this.prop("id").substr(3,4) + "_",
		okLabel: "   OK   ",
		errMsg1: "Please drag each card over the given piles.",
		errMsg3: "Already 3 in this pile.",
		errMsg2: "Please fill the other specify textbox.",
		pileArray: [17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1],
		cardArray: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],
		pileText: ["Not a factor at all","Minor factor","Major factor","Don't know"], //Please pass the text in the same order of precodes passed to the pileArray parameter//
		cardText: ["Efficacy","Safety / tolerability","Product formulation (e.g., IV vs. oral)","Dosing schedule","Indication breadth","Historical familiarity with using and purchasing the product","Patient convenience","Storage logistics (e.g., shelf life, refrigeration)","Administration logistics (e.g., staff time required, chair time required)","Hurdles to insurance coverage","Number of available alternatives","Patient out-of-pocket costs","Drug acquisition cost","Total cost of care","Drug reimbursement amount","Revenue contribution","<span title='Tooltip goes here'>Margin / net cost recovery</span>"], //Please pass the text in the same order of precodes passed to the cardArray parameter//
		headingtext: "STRONG INFLUENCE",
		bootomtext: "NO INFLUENCE",
		stageWidth: 1100,
		pileHeadingHeight: 0,
		pileWidth: 530,
		pileHeight: 30,
		pileDistance: 6,
		cardWidth: 510,
		cardHeight: 28,
		cardDistance: 8,
		counter: -1,
		posX: 0,
		posY: 49,
		oldPosX: 0,
		isMoved: false,
		dataArray: new Array(),
		otherSpecify: [], //Leave it blank if you don't have other specify card//
		otherSpecifyMandatory: true, //Put false if rating other specify card(s) is not mandatory//
		dep: 500,
		dropInFlag: false,
		timer: null,
		isAndroid: (navigator.userAgent.toLowerCase().indexOf("android") > -1)? true : false,
		finishFlag: true
	}
	var protocolRef = "_";
	$.extend(_obj, SPObj);

	_obj.posX = Math.round((_obj.stageWidth - (_obj.pileArray.length * _obj.pileWidth + (_obj.pileArray.length - 1) * _obj.pileDistance))/2);
	if(_obj.posX < 0)
	{
		_obj.posX = 0;
		while(_obj.posX + _obj.pileWidth <= _obj.stageWidth)
		{
			_obj.posX += _obj.pileWidth + _obj.pileDistance;
		}
		_obj.posX = Math.round((_obj.stageWidth - _obj.posX + _obj.pileDistance)/2);
	}
	_obj.oldPosX = _obj.posX = 0;



	// if($("meta[name=viewport]").length && viewportSize.getWidth() < _obj.stageWidth)
	// {
	// 	$("meta[name=viewport]").prop('content', 'width=' + (_obj.stageWidth + 20));
	// }



	
	var rootDiv = $("<div>");
	rootDiv.prop({id: "rootDiv" + _obj.primeKey});
	rootDiv.css({width: _obj.stageWidth, position: "relative",backgroundImage: "url("+protocolRef+"//media7.surveycenter.com/1614907/HTML5/Q37/images/arrow.png)",backgroundRepeat: "no-repeat", backgroundPosition: (_obj.pileWidth-100)/2, backgroundPositionY: 15});
	rootDiv.on("click", rootDivClickHandler);
	//rootDiv.addClass("borderClass");
	this.html("");
	this.append(rootDiv);

	document.body.ondragstart = function(){return true};
	$(document.body).on("selectstart", function(){return false});
	$(_obj.nextBRef).css({visibility: "visible", display: "inline"});
	$(_obj.nextBRef).on("click", submitHandler);
	
	createPiles();

	function createPiles()
	{
		var pile;
		var dropOpts;
		var box1;
		var cardContent;
		var box2;
		var comboBox;
		var comboBoxTextNode;
		var comboBoxArrow;
		var comboBoxDiv;


		headingtext = $("<div>");
		headingtext.prop({id: "headingtext" + _obj.primeKey});
		headingtext.css({left : (_obj.stageWidth - _obj.cardWidth)/2 - 100, position: "absolute", top:0});
		headingtext.html("<b>"+_obj.headingtext+"</b>");
		$("#rootDiv" + _obj.primeKey).append(headingtext);

		bootomtext = $("<div>");
		bootomtext.prop({id: "bootomtext" + _obj.primeKey});
		bootomtext.css({left : (_obj.stageWidth - _obj.cardWidth)/2 - 80, position: "absolute", bottom: 0});
		bootomtext.html("<b>"+_obj.bootomtext+"</b>");
		$("#rootDiv" + _obj.primeKey).append(bootomtext);

		for(var i = 0; i < _obj.pileArray.length; i++)
		{
			pile = $("<span>");
			pile.prop({id: "pile" + _obj.primeKey + _obj.pileArray[i]});
			pile.css({backgroundColor: "#ffffff", position: "absolute", left: _obj.posX, top: _obj.posY});
			pile.data({pilePosX: _obj.posX, pilePosY: _obj.posY});
			$("#rootDiv" + _obj.primeKey).append(pile);
			if(_obj.isAndroid)
			{
				dropOpts = {hoverClass: "activatedClass", drop: dropInHandler, out: dropOutHandler, over: dropOverHandler};
			}
			else
			{
				dropOpts = {tolerance: "pointer", hoverClass: "activatedClass", drop: dropInHandler, out: dropOutHandler, over: dropOverHandler};
			}
			$("#pile" + _obj.primeKey + _obj.pileArray[i]).droppable(dropOpts);
			

			box1 = $("<div>");
			box1.prop({align: "center"});
			box1.css({width: _obj.pileWidth, height: _obj.pileHeadingHeight, cursor: "default", border: "solid 1px #4f81bd", borderRight: "solid 1px #4f81bd"});
			// pile.append(box1);

			// cardContent = $("<div>");
			// cardContent.html("<b>" + _obj.pileText[i] + "</b>");
			// try
			// {
			// 	if(document.body.style.textShadow == undefined)
			// 	{
			// 		cardContent.css({color: "#ffffff"});
			// 		box1.css({backgroundColor: "#3399cc"});
			// 	}
			// 	else
			// 	{
			// 		box1.css({background: "linear-gradient(#57add1,#E4F2F8)"});
			// 	}
			// }
			// catch(err)
			// {
			// 	cardContent.css({color: "#ffffff"});
			// 	box1.css({backgroundColor: "#3399cc"});
			// }
			
			// // box1.append(cardContent);
			// cardContent.css({position: "relative", top: Math.round((_obj.pileHeadingHeight - cardContent.height())/2)});
			

			box2 = $("<div>");
			box2.css({width: _obj.pileWidth, height: _obj.pileHeight, backgroundColor: "#ffffff", border: "solid 1px #4f81bd", borderTopWidth: 1, borderRight: "solid 1px #4f81bd", borderBottom: "solid 1px #4f81bd"});
			box2.addClass("borderClass");
			pile.append(box2);
			
			comboBox = $("<div>");
			comboBox.prop({id: "combo" + _obj.primeKey + _obj.pileArray[i]});
			comboBox.css({width: _obj.pileWidth, height: 17, backgroundColor: "#ffffff", position: "absolute", left: _obj.posX, overflow: "hidden", cursor: "default", padding: "1px 0px 0px 1px", top: _obj.posY + _obj.pileHeadingHeight + _obj.pileHeight + 10, border: "solid 1px #aaaaaa", display: "none"});
			$("#rootDiv" + _obj.primeKey).append(comboBox);

			comboBoxTextNode = $("<div>");
			comboBoxTextNode.prop({id: "comboTextNode" + _obj.primeKey + _obj.pileArray[i]});
			comboBox.append(comboBoxTextNode);

			comboBox.draggable();
			comboBox.on("dragstart", function(){return false});
			comboBox.on("mouseover", focusInComboHandler);
			comboBox.on("mouseout", focusOutComboHandler);
			comboBox.on("mousedown", showComboHandler);

			/*if(window.PIE && !document.addEventListener)
			{
				PIE.attach(document.getElementById("pile" + _obj.primeKey + _obj.pileArray[i]));
			}*/

			comboBoxDiv = $("<div>");
			comboBoxDiv.prop({id: "comboDiv" + _obj.primeKey + _obj.pileArray[i]});
			comboBoxDiv.css({width: _obj.pileWidth + 2, backgroundColor: "#ffffff", border: "solid 1px #aaaaaa", borderTopWidth: 0, position: "absolute", left: _obj.posX, top: _obj.posY + _obj.pileHeadingHeight + _obj.pileHeight + 30, zIndex: 2000 + Number(_obj.pileArray[i]), display: "none"});
			$("#rootDiv" + _obj.primeKey).append(comboBoxDiv);

			// _obj.posX += _obj.pileWidth + _obj.pileDistance;
			_obj.posY += _obj.pileHeight + _obj.pileDistance;
			if(_obj.posX + _obj.pileWidth > _obj.stageWidth)
			{
				_obj.posX = _obj.oldPosX;
				_obj.posY += _obj.pileHeadingHeight + _obj.pileHeight + 50;
			}
		}

		// _obj.posX = Math.round((_obj.stageWidth - (_obj.cardArray.length * _obj.cardWidth + (_obj.cardArray.length - 1) * _obj.cardDistance))/2);
			_obj.posX += _obj.pileWidth + _obj.pileDistance +  50;

		if(_obj.posX < 0)
		{
			_obj.posX = 0;
			while(_obj.posX + _obj.cardWidth <= _obj.stageWidth)
			{
				_obj.posX += _obj.cardWidth + _obj.cardDistance;
			}
			_obj.posX = Math.round((_obj.stageWidth - _obj.posX + _obj.cardDistance)/2);
		}
		_obj.oldPosX = _obj.posX;
		_obj.posY = 51;
		 
		createCards();
	}


	function createCards()
	{
		var card;
		var cardContent;
		var openEndBox;
		var tooltip;
		var dragOpts;

		var backgroundBox = $("<div>");
		backgroundBox.css({width: _obj.cardWidth + 18, height: _obj.cardHeight + 36, backgroundColor: "#cccccc", border: "ridge 4px #999999", position: "absolute", left: _obj.posX - 11, top: _obj.posY - 30, cursor: "default", paddingTop: 2, visibility: (_obj.cardWidth == Math.abs(_obj.cardDistance))? "visible" : "hidden", textAlign: "center"});
		backgroundBox.html("<b><u>Card Deck</u></b>");
		$("#rootDiv" + _obj.primeKey).append(backgroundBox);

		for(var i = 0; i < _obj.cardArray.length; i++)
		{
			card = $("<div>");
			card.prop({id: "card" + _obj.primeKey + _obj.cardArray[i], align: "center"});
			card.css({width: _obj.cardWidth, height: _obj.cardHeight, position: "absolute", left: _obj.posX, top: _obj.posY, cursor: "pointer", zIndex: _obj.cardArray.length - i, borderRadius: 4, border: "solid 1px #bbbbbb", borderRight: "solid 1px #999999", borderBottom: "solid 1px #999999"});
			
			try
			{
				if(document.body.style.textShadow == undefined)
				{
					card.css({backgroundColor: "#eeeeee"});
				}
				else
				{
					card.css({background: "linear-gradient(#ffffff,#dedede)"});
				}
			}
			catch(err)
			{
				card.css({backgroundColor: "#eeeeee"});
			}

			if(document.addEventListener)
			{
				card.addClass("msTouchClass");
			}
			
			card.data({num: i, depth: card.css("zIndex"), droppedInside: false, cardPosX: _obj.posX, cardPosY: _obj.posY});
			$("#rootDiv" + _obj.primeKey).append(card);

			cardContent = $("<div>");
			cardContent.prop({id: "cardContent" + _obj.primeKey + _obj.cardArray[i]});
			cardContent.css({width: _obj.cardWidth - 6, position: "relative", wordWrap: "break-word"});
			cardContent.html("<b>" + _obj.cardText[i] + "</b>");
			card.append(cardContent);
			cardContent.css({top: Math.round((_obj.cardHeight - cardContent.height())/2)});
			if(_obj.cardText[i].toLowerCase().indexOf("<span") != -1)
			{
				if(_obj.cardText[i].toLowerCase().indexOf("title='") != -1)
				{
					tooltipText = _obj.cardText[i].substring(_obj.cardText[i].indexOf("title='") + 7, _obj.cardText[i].indexOf("'>"));
				}
				else
				{
					tooltipText = _obj.cardText[i].substring(_obj.cardText[i].indexOf('title="') + 7, _obj.cardText[i].indexOf('">'));
				}
				cardContent.on("mouseup", {tooltipText: tooltipText}, showTooltip);

				cardContent.html("<b>" + _obj.cardText[i].replace("title", "titl") + "</b>");
			}
			
			for(var j = 0; j < _obj.otherSpecify.length; j++)
			{
				if(_obj.otherSpecify[j] == _obj.cardArray[i])
				{
					cardContent.css({top: Math.round((_obj.cardHeight - cardContent.height())/2) - 18});

					openEndBox = $("<input>");
					openEndBox.prop({id: "openEnd" + _obj.primeKey + _obj.cardArray[i], type: "text"});
					openEndBox.css({width: _obj.cardWidth - 20, position: "relative", top: cardContent.position().top + 5 + "px"});
					card.append(openEndBox);

					tooltip = $("<div>");
					tooltip.prop({id: "tooltip" + _obj.primeKey + _obj.cardArray[i]});
					tooltip.html("Please fill the textbox and then drag the card.");
					tooltip.css({backgroundColor: "#ffff00", border: "solid 1px #999999", position: "relative", width: _obj.cardWidth - 2, left: 0, visibility: "hidden"});
					card.append(tooltip);
					tooltip.css({top: cardContent.position().top - 22 - tooltip.height()});
					
					card.draggable({disabled: true});
					card.on("mousedown", otherSpecifyCardHandler);
					openEndBox.on("keyup", keysHandler);
					break;
				}
			}
			
			// _obj.posX += _obj.cardWidth + _obj.cardDistance;
			_obj.posY += _obj.cardHeight + _obj.cardDistance;
			if(_obj.posX + _obj.cardWidth > _obj.stageWidth)
			{
				_obj.posX = _obj.oldPosX;
				_obj.posY += _obj.cardHeight + 10;
			}
			_obj.dataArray.push(-999);
			dragOpts = {containment: "#rootDiv" + _obj.primeKey, start: dragStartHandler, stop: dragStopHandler};
			card.draggable(dragOpts);
		}

		var evalHeight = card.position().top + _obj.cardHeight;
		$("#rootDiv" + _obj.primeKey).css({height: 713});
	}

	function dropInHandler(pEvent, pObj)
	{
		var ref = $(pEvent.target);
		var refId = ref.prop("id").substr(ref.prop("id").indexOf("_") + 1, 8);

		var cardRef = $(pObj.draggable[0]);
		var cardRefId = cardRef.prop("id").substr(cardRef.prop("id").indexOf("_") + 1, 8);

		var countCard = 0;

		for(var i = 0; i < _obj.dataArray.length; i++)
		{
			if (refId == _obj.dataArray[i]) {
				countCard++;
			}
		}

		
		if (countCard == 3) 
		{	
			cardRef.data({droppedInside: false});
			createDialog(_obj.errMsg3, _obj);
			$("#alertBoxContent" + _obj.primeKey).children().eq(5).prop("value", _obj.okLabel);
			return false;
		}	


		_obj.dropInFlag = true;
		//cardRef.animate({left: Math.round(ref.data("pilePosX") + (_obj.pileWidth - _obj.cardWidth)/2), top: Math.round(ref.data("pilePosY") + _obj.pileHeadingHeight + (_obj.pileHeight - _obj.cardHeight)/2)}, 400);
		if(_obj.dataArray[cardRef.data("num")] != -999)
		{
			updateCombo(false, cardRefId, _obj.dataArray[cardRef.data("num")]);
		}
		updateCombo(true, cardRefId, refId);

		updatePosition();
		_obj.dataArray[cardRef.data("num")] = refId;
	}

	function dropOutHandler(pEvent, pObj)
	{
		$(pObj.draggable[0]).data({droppedInside: false});
	}

	function dropOverHandler(pEvent, pObj)
	{
		$(pObj.draggable[0]).data({droppedInside: true});
	}

	function dragStartHandler(pEvent, pObj)
	{
		var ref = $(pEvent.target);
		var refId = ref.prop("id").substr(ref.prop("id").indexOf("_") + 1, 8);

		_obj.isMoved = true;
		_obj.dropInFlag = false;
		ref.css({zIndex: _obj.dep++});
		if($("#openEnd" + _obj.primeKey + refId).length)
		{
			$("#openEnd" + _obj.primeKey + refId).blur();
		}
		hideComboBoxes();
	}

	function dragStopHandler(pEvent, pObj)
	{
		var ref = $(pEvent.target);
		var refId = ref.prop("id").substr(ref.prop("id").indexOf("_") + 1, 8);
		_obj.isMoved = false;

		if(ref.data("droppedInside") == false && _obj.dropInFlag == false)
		{
			if($("#openEnd" + _obj.primeKey + refId).length)
			{
				$("#openEnd" + _obj.primeKey + refId).prop({disabled: false});
			}
			ref.animate({width: _obj.cardWidth, left: ref.data("cardPosX"), top: ref.data("cardPosY")}, 400);
			$("#cardContent" + _obj.primeKey + refId).css({width: _obj.cardWidth - 6});
			$("#cardContent" + _obj.primeKey + refId).css({top: (_obj.cardHeight - $("#cardContent" + _obj.primeKey + refId).height())/2});
			
			if(_obj.dataArray[ref.data("num")] != -999)
			{
				updateCombo(false, refId, _obj.dataArray[ref.data("num")]);
			}
			_obj.dataArray[ref.data("num")] = -999;

			if(_obj.cardWidth != Math.abs(_obj.cardDistance) && _obj.cardDistance < 0)
			{
				ref.css({zIndex: ref.data("depth")});
			}

			updatePosition();
		}
		else
		{
			if($("#openEnd" + _obj.primeKey + refId).length)
			{
				$("#openEnd" + _obj.primeKey + refId).prop({disabled: true});
			}
		}
	}

	function updatePosition()
	{
		for(var h = 0; h < _obj.pileArray.length; h++)
		{
			var pEvent = $("#pile" + _obj.primeKey + _obj.pileArray[h]);
			var pRef = _obj.pileArray[h];
			var comboRef = $("#comboDiv" + _obj.primeKey + pRef);
			var comboRefLength = comboRef.children().length;
			var xPos = pEvent.data("pilePosX") + 5;
			var yPos = pEvent.data("pilePosY") + 1;
			var distance = 5;

			for(var i = comboRef.children().length - 1; i >= 0; i--)
			{
				$("#card" + _obj.primeKey + comboRef.children().eq(i).prop("value")).css({fontSize: (comboRefLength == 1)? 13 + "px" : (comboRefLength == 2)? 12 + "px" : 10 + "px"});
				$("#cardContent" + _obj.primeKey + comboRef.children().eq(i).prop("value")).css({width: _obj.cardWidth/comboRefLength});
				$("#cardContent" + _obj.primeKey + comboRef.children().eq(i).prop("value")).css({top: (_obj.cardHeight - $("#cardContent" + _obj.primeKey + comboRef.children().eq(i).prop("value")).height())/2});

				$("#card" + _obj.primeKey + comboRef.children().eq(i).prop("value")).animate({left: xPos, top: yPos, width: _obj.cardWidth/comboRefLength}, 300);

				xPos += _obj.cardWidth/comboRefLength + distance;
			}
		}
	}

	function rootDivClickHandler(pEvent)
	{
		var ref = $(pEvent.target);
		
		if(ref.prop("id") == "rootDiv" + _obj.primeKey)
		{
			hideComboBoxes();
		}
	}

	function updateCombo(pFlag, pCardText, pComboNum)
	{
		var ref = $("#comboDiv" + _obj.primeKey + pComboNum);
		
		if(pFlag)
		{
			var tempArray = new Array();
			var comboOption = $("<div>");
			comboOption.prop({id: "comboOption" + _obj.primeKey + pComboNum, value: pCardText});
			comboOption.html(_obj.cardText[$("#card" + _obj.primeKey + pCardText).data("num")]);
			comboOption.css({borderBottom: "dotted 1px #999999", padding: "3px 3px 3px 3px", cursor: "default"});
			tempArray.push(comboOption);

			for(var i = 0; i < ref.children().length; i++)
			{
				tempArray.push(ref.children().eq(i));
			}
			ref.empty();
			
			for(var i = 0; i < tempArray.length; i++)
			{
				ref.append(tempArray[i]);
				//alert(tempArray[i].prop("id"));
				tempArray[i].on("dragstart", function(){return false});
				tempArray[i].on("click", selectComboRowHandler);
				tempArray[i].on("mouseover", focusInComboRowHandler);
				tempArray[i].on("mouseout", focusOutComboRowHandler);
			}
		}
		else
		{
			for(var i = 0; i < ref.children().length; i++)
			{
				if(pCardText == ref.children().eq(i).prop("value"))
				{
					ref.children().eq(i).remove();
				}
			}
		}

		if(ref.children().length != 0)
		{
			$("#comboTextNode" + _obj.primeKey + pComboNum).html(ref.children().eq(0).html());
		}
		else
		{
			$("#comboTextNode" + _obj.primeKey + pComboNum).html("");
		}
	}

	function focusInComboHandler(pEvent)
	{
		var ref = $(pEvent.currentTarget);

		ref.children().eq(1).prop({src: protocolRef + "//dcqhpema7gk9a.cloudfront.net/IND/HTML5/comboBoxArrowBlue.png"});
		ref.css({borderColor: "#3399cc"});
	}

	function focusOutComboHandler(pEvent)
	{
		var ref = $(pEvent.currentTarget);

		ref.children().eq(1).prop({src: protocolRef + "//dcqhpema7gk9a.cloudfront.net/IND/HTML5/comboBoxArrowGrey.png"});
		ref.css({borderColor: "#aaaaaa"});
	}

	function showComboHandler(pEvent)
	{
		var ref = $(pEvent.currentTarget);
		var refId = ref.prop("id").substr(ref.prop("id").indexOf("_") + 1, 8);
		var jQueryRef = $("#comboDiv" + _obj.primeKey + refId);
		var totalHeight = 0;
		
		if(jQueryRef.css("display") == "none")
		{
			hideComboBoxes();
			jQueryRef.css({display: "block"});
			
			for(var i = 0; i < jQueryRef.children().length; i++)
			{
				totalHeight += jQueryRef.children().eq(i).outerHeight();
			}
			
			if(jQueryRef.children().length > 0)
			{
				jQueryRef.css({height: totalHeight - 1, overflow: "hidden"});
			}
			else
			{
				jQueryRef.css({height: 20});
			}

			if(jQueryRef.position().top + jQueryRef.height() > $("#rootDiv" + _obj.primeKey).height())
			{
				jQueryRef.css({height: $("#rootDiv" + _obj.primeKey).height() - jQueryRef.position().top, overflow: "auto"});
			}
			
			jQueryRef.hide();
			jQueryRef.slideDown("fast");
		}
		else
		{
			jQueryRef.slideUp("fast");
		}
	}

	function hideComboBoxes()
	{
		for(var i = 0; i < _obj.pileArray.length; i++)
		{
			$("#comboDiv" + _obj.primeKey + _obj.pileArray[i]).slideUp("fast");
		}
	}

	function focusInComboRowHandler(pEvent)
	{
		var ref = $(pEvent.currentTarget);
		ref.css({backgroundColor: "#cceeff"});
	}

	function focusOutComboRowHandler(pEvent)
	{
		var ref = $(pEvent.currentTarget);
		ref.css({backgroundColor: "#ffffff"});
	}

	function selectComboRowHandler(pEvent)
	{
		var ref = $(pEvent.currentTarget);
		var refId = ref.prop("id").substr(ref.prop("id").indexOf("_") + 1, 8);

		for(var i = 0; i < _obj.cardArray.length; i++)
		{
			if(ref.prop("value") == $("#card" + _obj.primeKey + _obj.cardArray[i]).prop("id").substr($("#card" + _obj.primeKey + _obj.cardArray[i]).prop("id").indexOf("_") + 1, 8))
			{
				updateCombo(false, $("#card" + _obj.primeKey + _obj.cardArray[i]).prop("id").substr($("#card" + _obj.primeKey + _obj.cardArray[i]).prop("id").indexOf("_") + 1, 8), refId);
				$("#card" + _obj.primeKey + _obj.cardArray[i]).css({zIndex: _obj.dep++});
				updateCombo(true, $("#card" + _obj.primeKey + _obj.cardArray[i]).prop("id").substr($("#card" + _obj.primeKey + _obj.cardArray[i]).prop("id").indexOf("_") + 1, 8), refId);
				break;
			}
		}
		hideComboBoxes();
	}

	function otherSpecifyCardHandler(pEvent)
	{
		var ref = $(pEvent.currentTarget);
		var refId = ref.prop("id").substr(ref.prop("id").indexOf("_") + 1, 8);
	
		if($.trim($("#openEnd" + _obj.primeKey + refId).prop("value")) == "")
		{
			ref.draggable({disabled: true});
			$("#tooltip" + _obj.primeKey + refId).css({visibility: "visible"});
		}
		else
		{
			if(ref.prop("id").indexOf("openEnd") != -1 && $("#openEnd" + _obj.primeKey + refId).prop("disabled") == false && ("ontouchstart" in document.documentElement || (window.navigator.msPointerEnabled && viewportSize.getWidth() < 1200)))
			{
				ref.parent().draggable({disabled: true});
				clearTimeout(_obj.timer);
				_obj.timer = setTimeout(function(){ref.parent().draggable({disabled: false});}, 3000);
			}
		}
	}

	function keysHandler(pEvent)
	{
		var ref = $(pEvent.currentTarget);
		var refId = ref.prop("id").substr(ref.prop("id").indexOf("_") + 1, 8);

		clearTimeout(_obj.timer);
		var str = "";
		var flag = true;
		
		if(pEvent.keyCode == 32)
		{
			if(ref.prop("value").charAt(0) == " ")
			{
				ref.prop({value: ""});
			}
			for(var i = 0; i < ref.prop("value").length; i++)
			{
				if(ref.prop("value").charAt(i) == " ")
				{
					if(flag)
					{
						str += ref.prop("value").charAt(i);
					}
					flag = false;
				}
				else
				{
					flag = true;
				}
				if(flag)
				{
					str += ref.prop("value").charAt(i);
				}
			}
			ref.prop({value: str});
		}
		if($.trim(ref.prop("value")) == "")
		{
			ref.parent().draggable({disabled: true});
			$("#tooltip" + _obj.primeKey + refId).css({visibility: "visible"});
		}
		else
		{
			ref.parent().draggable({disabled: false});
			$("#tooltip" + _obj.primeKey + refId).css({visibility: "hidden"});
		}
	}

	function showTooltip(pEvent)
	{
		if(!$("#alertBox2").length && !_obj.isMoved)
		{
			var alertBox2 = $("<div>");
			alertBox2.prop({id: "alertBox2"});
			alertBox2.css({left: 0, top: 0, width: "100%", height: "100%", overflow: "auto", backgroundImage: "url(http://media7.surveycenter.com/1542721/greyPNG.png)", position: "fixed", zIndex: 3000});
			$("body").append(alertBox2);
			
			var alertBoxContent2 = $("<div>");
			alertBoxContent2.prop({align: "left"});
			alertBoxContent2.css({width: "90%", maxWidth: 900, border: "solid 1px #4f81bd", borderTop: "solid 30px #4f81bd", borderRadius: 5, backgroundColor: "#ffffff", position: "absolute", fontFamily: "Arial", fontWeight: "bold", fontSize: 16 + "px", padding: 20});
			alertBoxContent2.html(pEvent.data.tooltipText);
			alertBox2.append(alertBoxContent2);
			alertBoxContent2.css({left: Math.round((alertBox2.width() - alertBoxContent2.outerWidth())/2), top: ((alertBox2.height() - alertBoxContent2.outerHeight())/2 < 0)? 10 : (alertBox2.height() - alertBoxContent2.outerHeight())/2 - 50});
			alertBox2.on("click", removeTooltip);

			var crossSign = $("<div>");
			crossSign.css({position: "absolute", right: 10, top: -23, color: "#ffffff", cursor: "pointer", fontFamily: "Arial", fontWeight: "bold", fontSize: 16 + "px"});
			crossSign.html("X");
			alertBoxContent2.append(crossSign);

			_obj.isMoved = false;
		}
	}

	function removeTooltip(pEvent)
	{
		var ref = $(pEvent.currentTarget);
		ref.remove();
	}


	function submitHandler()
	{
		for(var i = 0; i < _obj.dataArray.length; i++)
		{
			if(_obj.dataArray[i] == -999)
			{
				if($("#openEnd" + _obj.primeKey + _obj.cardArray[i]).length && _obj.otherSpecifyMandatory == false)
				{
					continue;
				}
				else
				{
					createDialog(_obj.errMsg1, _obj);
					$("#alertBoxContent" + _obj.primeKey).children().eq(5).prop("value", _obj.okLabel);
					return false;
				}
			}
		}
		
		if(_obj.finishFlag)
		{
			_obj.finishFlag = false;
			var finalStr = "";
			if(_obj.otherSpecify.length > 0)
			{
				for(var h = 0; h < _obj.otherSpecify.length; h++)
				{
					if(_obj.dataArray[$("#card" + _obj.primeKey + _obj.otherSpecify[h]).data("num")] != -999)
					{
						if($.trim($("#openEnd" + _obj.primeKey + _obj.otherSpecify[h]).prop("value")) == "")
						{
							createDialog(_obj.errMsg2, _obj);
							$("#alertBoxContent" + _obj.primeKey).children().eq(5).prop("value", _obj.okLabel);
							_obj.finishFlag = true;
							return false;
						}
						else
						{
							finalStr += (h == 0)? $("#openEnd" + _obj.primeKey + _obj.otherSpecify[h]).prop("value") : ",~," + $("#openEnd" + _obj.primeKey + _obj.otherSpecify[h]).prop("value");
						}
					}
					else
					{
						finalStr += (h == 0)? "" : ",~,";
					}
				}
				window["setValue" + _obj.primeKey.slice(0,-1)](_obj.dataArray, finalStr);
			}
			else
			{
				window["setValue" + _obj.primeKey.slice(0,-1)](_obj.dataArray);
			}
		}
	}
}