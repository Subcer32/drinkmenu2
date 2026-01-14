var firebase;

$(function () {
    // Firebase Configuration
    var config = {
        databaseURL: "https://drink-cool-default-rtdb.firebaseio.com/"
    };
    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    var databaseItems = firebase.database().ref('/items');

    const App = {
        init: function () {
            this.bindEvents();
            this.initCustomSelect();
            this.initMenuImage(); // New init
            this.listenToData();
        },

        bindEvents: function () {
            // Tab Switching
            $('.tab-btn').click(function () {
                const tab = $(this).data('tab');

                // Update Buttons
                $('.tab-btn').removeClass('active');
                $(this).addClass('active');

                // Update Content
                $('.tab-content').removeClass('active');
                $('#tab-' + tab).addClass('active');
            });

            // List Filters
            $('.filter-tag').click(function () {
                const filter = $(this).data('filter');
                $('.filter-tag').removeClass('active');
                $(this).addClass('active');

                if (filter === 'all') {
                    $('.order-card').show();
                } else {
                    $('.order-card').hide();
                    $('.order-card[data-type="' + filter + '"]').show();
                }
            });

            // Stats Panel Trigger
            $('.panel-trigger').click(function () {
                $('#stats-panel').toggleClass('open');
            });

            // Submit Drink Order
            $('.btn-submit').click(function () {
                App.submitOrder();
            });

            // Delete All
            $('.btn-delete-all').click(function () {
                swal({
                    title: "確定要清空嗎？",
                    text: "這會刪除所有訂單，無法復原喔！",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                    .then((willDelete) => {
                        if (willDelete) {
                            databaseItems.remove();
                            swal("訂單已全部清空！", { icon: "success" });
                        }
                    });
            });

            // Delete Single Item (Delegation)
            $(document).on('click', '.btn-delete-item', function (e) {
                e.stopPropagation();
                const id = $(this).closest('.order-card').attr('id');
                swal({
                    title: "刪除此訂單？",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                    .then((willDelete) => {
                        if (willDelete) {
                            databaseItems.child(id).remove();
                        }
                    });
            });

            // Copy Stats
            $('#btn-copy-stats').click(function () {
                App.copyStats();
            });

            // Menu Modal
            $('#menu-side-trigger').click(function () {
                $('#menu-modal').fadeIn(200);
            });

            $('.close-modal').click(function () {
                $('#menu-modal').fadeOut(200);
            });

            $(window).click(function (event) {
                if ($(event.target).is('#menu-modal')) {
                    $('#menu-modal').fadeOut(200);
                }
            });
        },

        initMenuImage: function () {
            const databaseMenu = firebase.database().ref('/menuImage');

            // Zoom & Pan Variables
            let scale = 1;
            let panning = false;
            let pointX = 0;
            let pointY = 0;
            let startX = 0;
            let startY = 0;
            const $img = $('#menu-image');
            const $container = $('#menu-upload-area');

            function updateTransform() {
                $img.css('transform', `translate(${pointX}px, ${pointY}px) scale(${scale})`);
            }

            // 1. Listen for remote image updates
            databaseMenu.on('value', function (snapshot) {
                const imageUrl = snapshot.val();
                if (imageUrl) {
                    $('#menu-image').attr('src', imageUrl).show();
                    $('#upload-placeholder').hide();
                    $('#zoom-controls').fadeIn();

                    // Reset
                    scale = 1;
                    pointX = 0;
                    pointY = 0;
                    updateTransform();
                    // Restore responsive fitting
                    $img.css({
                        'max-width': '100%',
                        'max-height': '100%',
                        'width': 'auto',
                        'height': 'auto'
                    });
                } else {
                    $('#menu-image').hide();
                    $('#upload-placeholder').show();
                    $('#zoom-controls').hide();
                }
            });

            // 2. Zoom Controls
            $('#btn-zoom-in').click((e) => { e.preventDefault(); scale += 0.2; updateTransform(); });
            $('#btn-zoom-out').click((e) => { e.preventDefault(); scale = Math.max(0.2, scale - 0.2); updateTransform(); });
            $('#btn-zoom-reset').click((e) => {
                e.preventDefault();
                scale = 1;
                pointX = 0;
                pointY = 0;
                updateTransform();
                // Restore responsive fitting
                $img.css({ 'max-width': '100%', 'max-height': '100%' });
            });

            // 3. Mouse Wheel Zoom
            $container.on('wheel', function (e) {
                if (!$img.is(':visible')) return;
                e.preventDefault();

                const delta = e.originalEvent.deltaY;
                const zoomFactor = 0.1;

                if (delta < 0) {
                    scale += zoomFactor;
                } else {
                    scale = Math.max(0.2, scale - zoomFactor);
                }

                // Allow expanding beyond container
                if (scale > 1) {
                    $img.css({ 'max-width': 'none', 'max-height': 'none' });
                }

                updateTransform();
            });

            // 4. Drag to Pan
            $container.on('mousedown', function (e) {
                if (!$img.is(':visible')) return;
                e.preventDefault();
                startPanning(e.clientX, e.clientY);
            });

            $container.on('mousemove', function (e) {
                if (!panning) return;
                e.preventDefault();
                pan(e.clientX, e.clientY);
            });

            $(document).on('mouseup', function () {
                panning = false;
            });

            // Touch events for mobile
            $container.on('touchstart', function (e) {
                if (!$img.is(':visible')) return;
                const touch = e.originalEvent.touches[0];
                startPanning(touch.clientX, touch.clientY);
            });

            $container.on('touchmove', function (e) {
                if (!panning) return;
                e.preventDefault();
                const touch = e.originalEvent.touches[0];
                pan(touch.clientX, touch.clientY);
            });

            function startPanning(x, y) {
                panning = true;
                startX = x - pointX;
                startY = y - pointY;
                $img.css({ 'max-width': 'none', 'max-height': 'none' });
            }

            function pan(x, y) {
                pointX = x - startX;
                pointY = y - startY;
                updateTransform();
            }

            // 5. Handle Paste Event (Ctrl+V)
            window.addEventListener('paste', function (e) {
                // Only handle paste if modal is open
                if ($('#menu-modal').is(':visible')) {
                    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
                    for (let index in items) {
                        const item = items[index];
                        if (item.kind === 'file' && item.type.includes('image')) {
                            const blob = item.getAsFile();
                            App.processAndUploadImage(blob);
                        }
                    }
                }
            });

            // 6. Handle File Selection
            $('#btn-select-file').click(function () {
                $('#menu-file-input').click();
            });

            $('#menu-file-input').change(function (e) {
                const file = e.target.files[0];
                if (file) {
                    App.processAndUploadImage(file);
                }
            });

            // 7. Initialize Settings
            this.initSettings();
        },

        initSettings: function () {
            const dbRef = firebase.database().ref('/settings');
            let currentTab = 'sugar'; // 'sugar' or 'ice'

            // Default Values
            const defaultSugar = ["固定", "正常", "少糖 (7分)", "半糖 (5分)", "微糖 (3分)", "一分 (1分)", "無糖"];
            const defaultIce = ["正常", "少冰", "微冰", "去冰", "完全去冰", "溫的", "熱的"];

            // 1. Listen for Settings Data & Update UI + Dropdowns
            dbRef.on('value', function (snapshot) {
                let sData = snapshot.val();

                // Initialize defaults if empty
                if (!sData) {
                    sData = { sugar: defaultSugar, ice: defaultIce };
                    dbRef.set(sData);
                }

                if (!sData.sugar) dbRef.child('sugar').set(defaultSugar);
                if (!sData.ice) dbRef.child('ice').set(defaultIce);

                // Update Dropdowns
                App.updateDropdown('sugar', sData.sugar || defaultSugar);
                App.updateDropdown('ice', sData.ice || defaultIce);

                // Update Settings List if Open
                App.renderSettingsList(currentTab, sData[currentTab] || []);
            });

            // 2. Settings Modal Events
            $('#settings-side-trigger').click(() => $('#settings-modal').fadeIn(200));
            $('.close-settings').click(() => $('#settings-modal').fadeOut(200));

            // 3. Tab Switching
            $('.settings-tab').click(function () {
                $('.settings-tab').removeClass('active');
                $(this).addClass('active');
                currentTab = $(this).data('type');

                // Refresh List
                dbRef.once('value').then(snap => {
                    const data = snap.val() || {};
                    App.renderSettingsList(currentTab, data[currentTab] || []);
                });
            });

            // 4. Add New Setting
            $('#btn-add-setting').click(function () {
                const val = $('#new-setting-input').val().trim();
                if (!val) return;

                dbRef.child(currentTab).once('value', snapshot => {
                    const list = snapshot.val() || [];
                    list.push(val);
                    dbRef.child(currentTab).set(list);
                    $('#new-setting-input').val('');
                });
            });

            // 5. Delete Setting (Delegated)
            $(document).on('click', '.btn-delete-setting', function () {
                const index = $(this).data('index');
                swal({
                    title: "刪除此選項？",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true
                }).then(willDelete => {
                    if (willDelete) {
                        dbRef.child(currentTab).once('value', snapshot => {
                            const list = snapshot.val() || [];
                            if (index > -1 && index < list.length) {
                                list.splice(index, 1);
                                dbRef.child(currentTab).set(list);
                            }
                        });
                    }
                });
            });

            // 6. Edit Setting (Delegated)
            $(document).on('click', '.btn-edit-setting', function () {
                const index = $(this).data('index');
                const oldVal = $(this).data('val');

                swal({
                    content: {
                        element: "input",
                        attributes: {
                            placeholder: "修改為...",
                            type: "text",
                            value: oldVal
                        },
                    },
                    buttons: true
                }).then(newVal => {
                    if (newVal && newVal !== oldVal) {
                        dbRef.child(currentTab).once('value', snapshot => {
                            const list = snapshot.val() || [];
                            if (index > -1 && index < list.length) {
                                list[index] = newVal;
                                dbRef.child(currentTab).set(list);
                            }
                        });
                    }
                });
            });

            // 7. Reset Defaults
            $('.btn-reset-default').click(() => {
                swal({
                    title: "還原所有預設值？",
                    text: "這會覆蓋目前的甜度與冰塊設定",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true
                }).then(willReset => {
                    if (willReset) {
                        dbRef.set({ sugar: defaultSugar, ice: defaultIce });
                        swal("已還原預設值", { icon: "success" });
                    }
                });
            });
        },

        updateDropdown: function (type, list) {
            const $container = $(`.custom-select[data-target="${type}"] .custom-options`);
            let html = '';
            list.forEach(item => {
                html += `<div class="custom-option" data-value="${item}">${item}</div>`;
            });
            $container.html(html);
        },

        renderSettingsList: function (type, list) {
            const $ul = $('#settings-list');
            $ul.empty();
            if (!list || list.length === 0) {
                $ul.html('<li style="text-align:center;color:#666;padding:20px">暫無選項</li>');
                return;
            }

            list.forEach((item, index) => {
                const li = `
                    <li class="settings-item">
                        <span class="item-text">${item}</span>
                        <div class="item-actions">
                            <button class="btn-edit-setting" data-index="${index}" data-val="${item}">✎</button>
                            <button class="btn-delete-setting" data-index="${index}">🗑</button>
                        </div>
                    </li>
                `;
                $ul.append(li);
            });
        },

        processAndUploadImage: function (file) {
            swal("處理中...", "正在壓縮並上傳圖片", "info", { buttons: false, closeOnClickOutside: false });

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (event) {
                const img = new Image();
                img.src = event.target.result;
                img.onload = function () {
                    // Compression Logic
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const maxWidth = 1024; // Limit width

                    if (width > maxWidth) {
                        height = Math.round(height * (maxWidth / width));
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Compress to JPEG 0.7 quality
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);

                    // Upload to Firebase
                    firebase.database().ref('/menuImage').set(compressedDataUrl)
                        .then(() => {
                            swal("上傳成功！", "大家都可以看到這張菜單囉", "success");
                        })
                        .catch(err => {
                            swal("上傳失敗", "請稍微再試一次 : " + err.message, "error");
                        });
                }
            }
        },

        // Modified: initCustomSelect now only handles UI interactions, 
        // options are populated by updateDropdown via Firebase
        initCustomSelect: function () {
            $(document).on('click', '.custom-select-trigger', function (e) {
                e.stopPropagation();
                const $select = $(this).closest('.custom-select');
                $('.custom-select').not($select).removeClass('open');
                $select.toggleClass('open');
            });

            // Delegate event for dynamically added options
            $(document).on('click', '.custom-option', function () {
                const $option = $(this);
                const $select = $option.closest('.custom-select');
                const $trigger = $select.find('.custom-select-trigger');
                const $input = $('#' + $select.data('target'));

                $select.find('.custom-option').removeClass('selected');
                $option.addClass('selected');

                $trigger.text($option.text());
                $input.val($option.data('value'));

                $select.removeClass('open');
            });

            $(document).click(function () {
                $('.custom-select').removeClass('open');
            });
        },

        submitOrder: function () {
            const activeTab = $('.tab-content.active').attr('id');
            let data = {};
            let isValid = true;

            if (activeTab === 'tab-drink') {
                const name = $('#name').val().trim();
                const items = $('#items').val().trim();
                const sugar = $('#sugar').val();
                const ice = $('#ice').val();
                let money = $('#money').val().trim();

                if (!name || !items || !money) isValid = false;

                data = {
                    type: 'drink',
                    name: name,
                    items: items,
                    sugar: sugar || '固定',
                    ice: ice || '正常',
                    feed: $('#feed').val().trim(),
                    money: money,
                    remark: $('#remark').val().trim(),
                    displayItems: items, // Simplified string for validation/display
                    details: `${sugar} / ${ice}`
                };

            } else {
                const name = $('#bento-name').val().trim();
                const mainDish = $('#main-dish').val().trim();
                const riceType = $('#rice-type').val();
                let money = $('#bento-money').val().trim();

                if (!name || !mainDish || !money) isValid = false;

                const sides = $('#bento-sides').val().trim();

                data = {
                    type: 'bento',
                    name: name,
                    items: mainDish, // Store main dish as 'items' for consistency in stats
                    riceType: riceType || '正常飯',
                    feed: sides,     // Store sides in 'feed'
                    money: money,
                    remark: '',
                    displayItems: mainDish,
                    details: riceType + (sides ? ` + ${sides}` : '')
                };
            }

            if (!isValid) {
                swal("請填寫完整資料！", "姓名、品項和價格是必填的喔", "error");
                return;
            }

            swal({
                title: "確認送出？",
                text: `${data.name} 點了 ${data.displayItems} ($${data.money})`,
                icon: "info",
                buttons: true,
            })
                .then((willSubmit) => {
                    if (willSubmit) {
                        databaseItems.push(data);
                        swal("訂單已送出！", { icon: "success", timer: 1500 });
                        // Clear forms
                        $('input[type="text"], input[type="number"]').val('');
                    }
                });
        },

        listenToData: function () {
            const $list = $('#orders-list');

            databaseItems.on('value', function (snapshot) {
                $list.empty();
                const orders = snapshot.val();
                let totalDrinkCount = 0;
                let totalBentoCount = 0;
                let totalMoney = 0;

                // Grouping for stats
                const drinkGroups = {};
                const bentoGroups = {};

                if (orders) {
                    Object.keys(orders).forEach(key => {
                        const order = orders[key];
                        // Handle legacy data or new data missing type
                        const type = order.type || 'drink';

                        // Render Card
                        App.renderCard(key, order, type);

                        // Calculate Stats
                        totalMoney += parseInt(order.money) || 0;

                        if (type === 'drink') {
                            totalDrinkCount++;
                            const keyName = `${order.items}`;
                            if (!drinkGroups[keyName]) drinkGroups[keyName] = { count: 0, items: [] };
                            drinkGroups[keyName].count++;
                            drinkGroups[keyName].items.push(`${order.sugar}/${order.ice}` + (order.feed ? `+${order.feed}` : ''));
                        } else {
                            totalBentoCount++;
                            const keyName = `${order.items}`; // Main dish
                            if (!bentoGroups[keyName]) bentoGroups[keyName] = { count: 0, items: [] };
                            bentoGroups[keyName].count++;
                            bentoGroups[keyName].items.push(order.details);
                        }
                    });
                }

                App.updateStats(totalDrinkCount, totalBentoCount, totalMoney, drinkGroups, bentoGroups);

                // Re-apply current filter
                $('.filter-tag.active').click();
            });
        },

        renderCard: function (key, order, type) {
            const details = type === 'drink'
                ? `${order.sugar || ''} ${order.ice || ''} ${order.feed ? '+' + order.feed : ''}`
                : order.details;

            const typeLabel = type === 'drink' ? '飲料' : '便當';
            const icon = type === 'drink' ? '🧋' : '🍱';

            const html = `
                <div class="order-card" id="${key}" data-type="${type}">
                    <div class="order-header">
                        <span class="order-name">${order.name}</span>
                        <span class="order-tag">${typeLabel}</span>
                    </div>
                    <div class="order-item">${icon} ${order.items}</div>
                    <div class="order-details">${details}</div>
                    ${order.remark ? `<div class="order-details" style="color:#d4af37">備註: ${order.remark}</div>` : ''}
                    <div class="order-footer">
                        <span class="order-price">$${order.money}</span>
                        <button class="btn-delete-item" title="刪除"><i class="fas fa-trash"></i> 🗑</button>
                    </div>
                </div>
            `;
            $('#orders-list').prepend(html);
        },

        updateStats: function (dCount, bCount, money, dGroups, bGroups) {
            $('#total-count').text(`${dCount + bCount} (飲${dCount}/便${bCount})`);
            $('#total-money').text(`$${money}`);

            // Render Drink Stats
            let dHtml = '';
            for (let [name, data] of Object.entries(dGroups)) {
                dHtml += `
                    <div class="stat-item-row">
                        <span class="stat-name">${name}</span>
                        <span class="stat-count">${data.count}</span>
                    </div>
                `;
            }
            $('#stats-drink-list').html(dHtml || '<div style="color:#555;text-align:center">暫無資料</div>');

            // Render Bento Stats
            let bHtml = '';
            for (let [name, data] of Object.entries(bGroups)) {
                bHtml += `
                    <div class="stat-item-row">
                        <span class="stat-name">${name}</span>
                        <span class="stat-count">${data.count}</span>
                    </div>
                `;
            }
            $('#stats-bento-list').html(bHtml || '<div style="color:#555;text-align:center">暫無資料</div>');
        },

        copyStats: function () {
            let text = `【團購統計】\n`;
            text += `總金額: ${$('#total-money').text()}\n`;
            text += `總份數: ${$('#total-count').text()}\n\n`;

            text += `--- 飲料 ---\n`;
            $('#stats-drink-list .stat-item-row').each(function () {
                const name = $(this).find('.stat-name').text();
                const count = $(this).find('.stat-count').text();
                text += `${name} x${count}\n`;
            });

            text += `\n--- 便當 ---\n`;
            $('#stats-bento-list .stat-item-row').each(function () {
                const name = $(this).find('.stat-name').text();
                const count = $(this).find('.stat-count').text();
                text += `${name} x${count}\n`;
            });

            const $temp = $("<textarea>");
            $("body").append($temp);
            $temp.val(text).select();
            document.execCommand("copy");
            $temp.remove();

            swal("已複製到剪貼簿！", { icon: "success", timer: 1000 });
        }
    };

    App.init();
});
