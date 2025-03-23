document.addEventListener('DOMContentLoaded', () => {
    const targets = document.querySelectorAll('.target');
    let lastTouchTime = 0;
    const doubleTapDelay = 300; // Задержка для двойного касания (мс)

    targets.forEach(target => {
        target.style.position = 'absolute'; // Убедимся, что элементы позиционируются абсолютно

        // Флаги для разделения обработки мыши и касаний
        let isMouseDown = false;
        let isTouching = false;

        // --- События мыши ---
        target.addEventListener('mousedown', (e) => {
            if (isTouching) return; // Игнорируем, если уже есть касание
            isMouseDown = true;
            e.preventDefault();
            target.isDragging = true;
            target.originalLeft = parseInt(target.style.left, 10) || 0;
            target.originalTop = parseInt(target.style.top, 10) || 0;
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
                isMouseDown = false;
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
            if (isTouching) return;
            e.preventDefault();
            target.isSticky = true;
            target.originalLeft = parseInt(target.style.left, 10) || 0;
            target.originalTop = parseInt(target.style.top, 10) || 0;
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

        // --- События касаний ---
        target.addEventListener('touchstart', (e) => {
            if (isMouseDown) return; // Игнорируем, если уже есть мышь
            isTouching = true;

            if (e.touches.length === 1) {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTouchTime;

                // Двойное касание
                if (tapLength < doubleTapDelay && tapLength > 0) {
                    e.preventDefault();
                    target.isSticky = true;
                    target.originalLeft = parseInt(target.style.left, 10) || 0;
                    target.originalTop = parseInt(target.style.top, 10) || 0;
                    target.style.backgroundColor = 'blue';

                    const onTouchMove = (e) => {
                        if (target.isSticky && e.touches.length === 1) {
                            const touch = e.touches[0];
                            target.style.left = `${touch.clientX}px`;
                            target.style.top = `${touch.clientY}px`;
                        }
                    };

                    const onTouchStart = (e) => {
                        if (target.isSticky) {
                            const touch = e.touches[0];
                            const startX = touch.clientX;
                            const startY = touch.clientY;

                            const onTouchEnd = (e) => {
                                const endTouch = e.changedTouches[0];
                                const endX = endTouch.clientX;
                                const endY = endTouch.clientY;
                                const dx = endX - startX;
                                const dy = endY - startY;

                                if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
                                    target.isSticky = false;
                                    target.style.backgroundColor = 'red';
                                    document.removeEventListener('touchmove', onTouchMove);
                                    document.removeEventListener('touchstart', onTouchStart);
                                }
                            };
                            document.addEventListener('touchend', onTouchEnd, { once: true });
                        }
                    };

                    document.addEventListener('touchmove', onTouchMove);
                    document.addEventListener('touchstart', onTouchStart);

                    target.stickyTouchMove = onTouchMove;
                    target.stickyTouchStart = onTouchStart;
                }
                // Одиночное касание (перетаскивание)
                else {
                    e.preventDefault();
                    target.isDragging = true;
                    target.originalLeft = parseInt(target.style.left, 10) || 0;
                    target.originalTop = parseInt(target.style.top, 10) || 0;
                    const touch = e.touches[0];
                    const startX = touch.clientX;
                    const startY = touch.clientY;
                    const startLeft = target.originalLeft;
                    const startTop = target.originalTop;

                    const onTouchMove = (e) => {
                        if (target.isDragging && e.touches.length === 1) {
                            const touch = e.touches[0];
                            const dx = touch.clientX - startX;
                            const dy = touch.clientY - startY;
                            target.style.left = `${startLeft + dx}px`;
                            target.style.top = `${startTop + dy}px`;
                        } else if (e.touches.length > 1) {
                            target.isDragging = false;
                            target.style.left = `${target.originalLeft}px`;
                            target.style.top = `${target.originalTop}px`;
                            document.removeEventListener('touchmove', onTouchMove);
                            document.removeEventListener('touchend', onTouchEnd);
                        }
                    };

                    const onTouchEnd = () => {
                        isTouching = false;
                        target.isDragging = false;
                        document.removeEventListener('touchmove', onTouchMove);
                        document.removeEventListener('touchend', onTouchEnd);
                    };

                    document.addEventListener('touchmove', onTouchMove);
                    document.addEventListener('touchend', onTouchEnd);

                    target.dragTouchMove = onTouchMove;
                    target.dragTouchEnd = onTouchEnd;
                }
                lastTouchTime = currentTime;
            }
            // Два касания (изменение размера)
            else if (e.touches.length === 2) {
                e.preventDefault();
                target.isResizing = true;
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const initialDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
                const initialWidth = parseInt(target.style.width, 10) || 100;
                const initialHeight = parseInt(target.style.height, 10) || 100;

                const onTouchMove = (e) => {
                    if (target.isResizing && e.touches.length === 2) {
                        const touch1 = e.touches[0];
                        const touch2 = e.touches[1];
                        const currentDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
                        const scale = currentDistance / initialDistance;
                        let newWidth = initialWidth * scale;
                        let newHeight = initialHeight * scale;
                        const minSize = 20;
                        if (newWidth < minSize) newWidth = minSize;
                        if (newHeight < minSize) newHeight = minSize;
                        target.style.width = `${newWidth}px`;
                        target.style.height = `${newHeight}px`;
                    }
                };

                const onTouchEnd = () => {
                    isTouching = false;
                    target.isResizing = false;
                    document.removeEventListener('touchmove', onTouchMove);
                    document.removeEventListener('touchend', onTouchEnd);
                };

                document.addEventListener('touchmove', onTouchMove);
                document.addEventListener('touchend', onTouchEnd);
            }
        });

        // Обработка клавиши Esc (для мыши)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                targets.forEach(t => {
                    if (t.isSticky) {
                        t.isSticky = false;
                        t.style.backgroundColor = 'red';
                        if (t.stickyMouseMove) document.removeEventListener('mousemove', t.stickyMouseMove);
                        if (t.stickyMouseDown) document.removeEventListener('mousedown', t.stickyMouseDown);
                    }
                    if (t.isDragging) {
                        t.isDragging = false;
                        if (t.dragMouseMove) document.removeEventListener('mousemove', t.dragMouseMove);
                        if (t.dragMouseUp) document.removeEventListener('mouseup', t.dragMouseUp);
                    }
                    if (t.originalLeft !== undefined && t.originalTop !== undefined) {
                        t.style.left = `${t.originalLeft}px`;
                        t.style.top = `${t.originalTop}px`;
                    }
                });
            }
        });
    });
});