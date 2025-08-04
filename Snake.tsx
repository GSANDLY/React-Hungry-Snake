import { useEffect, useRef, useState } from "react";
import './Snake.css';

function Snake() {

    // 蛇肢节数组
    const [bodyItems, setBodyItems] = useState([{ x: 200, y: 300 }]);

    // 蛇当前移动方向
    const [direction, setDirection] = useState('right');

    // 食物位置
    const [foodPosition, setFoodPosition] = useState({ x: 300, y: 600 });

    // 游戏画布 ref
    const refPlayground = useRef(null);

    // 存储 animation frame ID
    let animationId: number | null = null;

    // 初始化让蛇动起来
    useEffect(() => {
        // 最后一次执行移动时间
        let lastTime = performance.now();

        const moveSnake = () => {
            if (performance.now() - lastTime >= 200) {
                // 蛇移动逻辑：获取当前蛇头
                const oldSnakeHead = bodyItems[0];

                // 根据原蛇头位置和方向生成新蛇头
                let newSnakeHead = generateNewSnakeHead(oldSnakeHead);

                // 新组装的蛇肢体数组，移除尾部并添加新头
                let newBodyItems = [newSnakeHead, ...bodyItems.slice(0, -1)];

                // 头部向前移动一步时，来判断是否吃到食物。若吃到，再加个新头
                if (ifEatFood(newSnakeHead)) {
                    newSnakeHead = generateNewSnakeHead(oldSnakeHead);
                    newBodyItems = [newSnakeHead, ...bodyItems.slice()];

                    // 重新设置新的食物
                    generateRandomFoodPosition();
                }

                // 更新蛇体状态
                setBodyItems(newBodyItems);

                // 蛇碰到墙壁
                handleOverFlowView();

                // 更新最后一次执行时间
                lastTime = performance.now();
            }

            // 请求下一帧
            animationId = requestAnimationFrame(moveSnake);
        };

        // 启动动画
        animationId = requestAnimationFrame(moveSnake);

        // 清理动画
        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, [bodyItems, direction]); // 依赖 bodyItems 和 direction，确保方向变化时更新

    // 是否吃到食物
    const ifEatFood = (snakeHead: { x: number; y: number; } | undefined) => {
        // 蛇头碰到食物
        return snakeHead && foodPosition.x === snakeHead.x && foodPosition.y === snakeHead.y;
    };

    // 蛇是否超过了边界
    const handleOverFlowView = () => {
        const snakeHead = bodyItems[0],
            x = snakeHead.x,
            y = snakeHead.y,
            viewWidth = refPlayground.current.clientWidth,
            viewHeight = refPlayground.current.clientHeight;

        if (x <= 0 || x >= viewWidth || y <= 0 || y >= viewHeight) {
            alert('游戏结束');
            return false;
        }
    };

    // 随机生成食物位置
    const generateRandomFoodPosition = () => {
        if (!refPlayground.current) return;
        const width = refPlayground.current.clientWidth - 10; // 减去蛇块宽度
        const height = refPlayground.current.clientHeight - 10; // 减去蛇块高度
        let newX, newY;

        // 确保与 10px 网格对齐
        do {
            newX = Math.floor(Math.random() * (width / 10)) * 10;
            newY = Math.floor(Math.random() * (height / 10)) * 10;

        // 检查是否与蛇体重叠
        } while (bodyItems.some((item) => item.x === newX && item.y === newY));

        setFoodPosition({ x: newX, y: newY });
    };

    // 根据原蛇头的位置，再结合蛇移动的方向来生成新蛇头
    const generateNewSnakeHead = (oldSnakeHead: { x: number, y: number }) => {
            switch (direction) {
            case 'up':
                return { x: oldSnakeHead.x, y: oldSnakeHead.y - 10 };
            case 'right':
                return { x: oldSnakeHead.x + 10, y: oldSnakeHead.y };
            case 'down':
                return { x: oldSnakeHead.x, y: oldSnakeHead.y + 10 };
            case 'left':
                return { x: oldSnakeHead.x - 10, y: oldSnakeHead.y };
        }
    };

    // 按下方向键处理事件
    const handleKeyDown = (event) => {
        switch (event.key) {
            case 'ArrowUp':
                setDirection('up');
                break;
            case 'ArrowRight':
                setDirection('right');
                break;
            case 'ArrowDown':
                setDirection('down');
                break;
            case 'ArrowLeft':
                setDirection('left');
                break;
        }
    }

    return (
        <div
            ref={refPlayground}
            className="snake-container"
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            {
                bodyItems.map((item, index) => {
                    return <div
                            className="snake-item"
                            style={{ left: `${item.x}px`, top: `${item.y}px` }}
                            key={index}
                        />
                })
            }
            {/* 食物 */}
            <div className="snake-item food" style={{ left: `${foodPosition.x}px`, top: `${foodPosition.y}px` }}/>
        </div>
    );
}

export default Snake;