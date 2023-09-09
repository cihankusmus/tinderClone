const tinderContainer = document.querySelector('.tinder');
const allCards = document.querySelectorAll('.tinderCard');

function initCards() {
    let newCards = document.querySelectorAll('.tinderCard:not(.removed)');

    newCards.forEach(function(card, i) {
        card.style.zIndex = allCards.length - i;
        card.style.transform = 'scale(' + (20 - i) / 20 + ') translateY(-' + 30 * i + 'px';
        card.style.opacity = (10 - i) / 10;
    });
    tinderContainer.classList.add('loaded');
}

initCards();

allCards.forEach(function (el) {
    let hammertime = new Hammer(el);

    hammertime.on('pan', function (event) {
        if (event.deltax === 0) return;
        if (event.center.x ===0 && event.center.y === 0) return;

        el.classList.add('moving');
        tinderContainer.classList.toggle('tinder_love', event.deltaX > 0);
        tinderContainer.classList.toggle('tinder_nope', event.deltaX < 0);

        let xMulti = event.deltaX * 0.2;
        let yMulti = event.deltaY / 300;
        let rotate = xMulti * yMulti;

        el.style.transform = 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)';
    });

    hammertime.on('panend', function (event) {
        el.classList.remove('moving');
        tinderContainer.classList.remove('tinder_love');
        tinderContainer.classList.remove('tinder_nope');

        let moveOutWidth = document.body.clientWidth;
        let keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

        el.classList.toggle('removed', !keep);

        if (keep) {
            el.style.transform = '';
        } else {
            let endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth);
            let toX = event.deltaX > 0 ? endX : -endX;
            let endY = Math.abs(event.velocityY) * moveOutWidth;
            let toY = event.deltaY > 0 ? endY : -endY;
            let xMulti = event.deltaX * 0.03;
            let yMulti = event.deltaY / 80;
            let rotate = xMulti * yMulti;

            el.style.transform = 'translate(' + toX + 'px, ' + (toY + event.deltaY) + 'px) rotate(' + rotate + 'deg)';
            initCards();
        }
    });
});

function createButtonListener(love) {
    return function (event) {
        let cards = document.querySelectorAll('.tinderCard:not(.removed)');
        let moveOutWidth = document.body.clientWidth * 1.5;

        if (!cards.length) return false;

        let card = cards[0];

        card.classList.add('removed');

        if (love) {
            card.style.transform = 'translate(' + moveOutWidth + 'px, -100px) rotate(-30deg)';
        } else {
            card.style.transform = 'translate(-' + moveOutWidth + 'px, -100px) rotate(30deg)';
        }

        initCards();

        event.preventDefault();
    };
}

let nopeListener = createButtonListener(false);
let loveListener = createButtonListener(true);

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'https://mavnvirtkvhbnvtmiddk.supabase.co';
const secretKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hdm52aXJ0a3ZoYm52dG1pZGRrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MzUwMDYyOSwiZXhwIjoyMDA5MDc2NjI5fQ.cWFtEEnx4NWVVH3gmSDbHZ4hgi5ZJ4mZmKQkChz-e9o';

const supabase = createClient(supabaseUrl, secretKey);

const renderPosts = async () => {
    const response = await fetch(`${supabaseUrl}/rest/v1/users`, {
        headers: {
            'Content-Type': 'application/json',
            'apikey': secretKey,
            'Authorization': `Bearer ${secretKey}`
        }
    }).then(x => x.json());

    const tinderCards = document.querySelector('.tinderCards');

    for (const responseData of response) {
        const image = await supabase
            .storage
            .from('image')
            .getPublicUrl(responseData.image);

        const card = document.createElement('div');
        card.classList.add('tinderCard');
        card.innerHTML = `
            <div class="tinderCardImg">
                <img src="${image.data.publicUrl}" alt="${responseData.name}">
            </div>
            <div class="userInfo">
                <h3>${responseData.name} ${responseData.age}</h3>
                
            </div>
            <div class="subIcon">
                <button class="nope"><img src="assets/img/x.svg" class="xBtn"></button>
                <button class="love"><img src="assets/img/heart.svg"></button>
            </div>
        `;

        card.querySelectorAll('.nope').forEach(button => {
            button.addEventListener('click', nopeListener);
        });
        card.querySelectorAll('.love').forEach(button => {
            button.addEventListener('click', loveListener);
        });
        tinderCards.appendChild(card);
    }
}

renderPosts();
