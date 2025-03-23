document.addEventListener('DOMContentLoaded', () => {
    const targets = document.querySelectorAll('.target');

    targets.forEach(target => {
        target.addEventListener('mousedown', (e) => {
            e.preventDefault();
            target.isDragging = true;

            target.originalLeft = parseInt(target.style.left, 10);
            target.originalTop = parseInt(target.style.top, 10);

            const startX = e.clientX;
            const startY = e.clientY;
            const startLeft = target.originalLeft;
            const startTop = target.originalTop;


            const onMouseMove = (e) => {
                if (target.isDragging) {
                    const dx = e.clientX - startX;
                    const dy = e.clientY - startY;
                    target.style.left = `${startLeft + dx}px`;
                    target.style.top = `${startTop + dy}px`;
                }
            };

            const onMouseUp = () => {
                target.isDragging = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);

            target.dragMouseMove = onMouseMove;
            target.dragMouseUp = onMouseUp;
        });

        target.addEventListener('dblclick', (e) => {
            e.preventDefault();
            target.isSticky = true;
            target.originalLeft = parseInt(target.style.left, 10);
            target.originalTop = parseInt(target.style.top, 10);
            target.style.backgroundColor = 'blue';

            const onMouseMove = (e) => {
                if (target.isSticky) {
                    target.style.left = `${e.clientX}px`;
                    target.style.top = `${e.clientY}px`;
                }
            };

            const onMouseDown = () => {
                target.isSticky = false;
                target.style.backgroundColor = 'red';
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mousedown', onMouseDown);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mousedown', onMouseDown);

            target.stickyMouseMove = onMouseMove;
            target.stickyMouseDown = onMouseDown;
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const targets = document.querySelectorAll('.target');
            targets.forEach(target => {
                if (target.isSticky) {
                    target.isSticky = false;
                    target.style.backgroundColor = 'red';
                    if (target.stickyMouseMove) {
                        document.removeEventListener('mousemove', target.stickyMouseMove);
                    }
                    if (target.stickyMouseDown) {
                        document.removeEventListener('mousedown', target.stickyMouseDown);
                    }
                }
                if (target.isDragging) {
                    target.isDragging = false;
                    if (target.dragMouseMove) {
                        document.removeEventListener('mousemove', target.dragMouseMove);
                    }
                    if (target.dragMouseUp) {
                        document.removeEventListener('mouseup', target.dragMouseUp);
                    }
                }
                if (target.originalLeft !== undefined && target.originalTop !== undefined) {
                    target.style.left = `${target.originalLeft}px`;
                    target.style.top = `${target.originalTop}px`;
                }
            });
        }
    });
});