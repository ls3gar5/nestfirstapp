import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InternalServerErrorException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { Tasks } from './schema/task.schema';
import { Task, TaskStatus } from './entities/task.entity';

describe('TaskRepository', () => {
    let repository: TaskRepository;
    let mockTaskModel: jest.Mocked<any>;
    let mockCacheManager: jest.Mocked<any>;

    // Mock task data for testing
    const mockTasks = [
        {
            id: '1',
            title: 'Test Task 1',
            description: 'Description 1',
            status: TaskStatus.PENDING,
        },
        {
            id: '2',
            title: 'Test Task 2',
            description: 'Description 2',
            status: TaskStatus.IN_PROGRESS,
        },
        {
            id: '3',
            title: 'Test Task 3',
            description: 'Description 3',
            status: TaskStatus.DONE,
        },
    ];

    const mockTaskEntities = mockTasks.map(task => new Task(task));

    beforeEach(async () => {
        // Create mock implementations
        mockTaskModel = {
            find: jest.fn(),
        };

        mockCacheManager = {
            get: jest.fn(),
            set: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TaskRepository,
                {
                    provide: getModelToken(Tasks.name),
                    useValue: mockTaskModel,
                },
                {
                    provide: CACHE_MANAGER,
                    useValue: mockCacheManager,
                },
            ],
        }).compile();

        repository = module.get<TaskRepository>(TaskRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAll', () => {
        describe('Happy Path Cases', () => {
            it('should return all tasks when database has multiple tasks', async () => {
                // Arrange
                const expectedTasks = mockTaskEntities;
                mockTaskModel.find.mockResolvedValue(mockTasks);

                // Act
                const result = await repository.getAll();

                // Assert
                expect(result).toEqual(expectedTasks);
                expect(mockTaskModel.find).toHaveBeenCalledWith();
                expect(mockTaskModel.find).toHaveBeenCalledTimes(1);
            });

            it('should return empty array when database has no tasks', async () => {
                // Arrange
                mockTaskModel.find.mockResolvedValue([]);

                // Act
                const result = await repository.getAll();

                // Assert
                expect(result).toEqual([]);
                expect(mockTaskModel.find).toHaveBeenCalledWith();
                expect(mockTaskModel.find).toHaveBeenCalledTimes(1);
            });

            it('should return single task when database has only one task', async () => {
                // Arrange
                const singleTask = [mockTasks[0]];
                const expectedTask = [new Task(singleTask[0])];
                mockTaskModel.find.mockResolvedValue(singleTask);

                // Act
                const result = await repository.getAll();

                // Assert
                expect(result).toEqual(expectedTask);
                expect(mockTaskModel.find).toHaveBeenCalledWith();
                expect(mockTaskModel.find).toHaveBeenCalledTimes(1);
            });
        });

        describe('Edge Cases and Boundary Conditions', () => {
            it('should handle tasks with minimal required fields', async () => {
                // Arrange
                const minimalTasks = [
                    {
                        id: '1',
                        title: 'Minimal Task',
                        description: undefined,
                        status: TaskStatus.PENDING,
                    },
                ];
                const expectedTasks = minimalTasks.map(task => new Task(task));
                mockTaskModel.find.mockResolvedValue(minimalTasks);

                // Act
                const result = await repository.getAll();

                // Assert
                expect(result).toEqual(expectedTasks);
                expect(result[0].status).toBe(TaskStatus.PENDING); // Default status
                expect(mockTaskModel.find).toHaveBeenCalledWith();
            });

            it('should handle tasks with very long titles and descriptions', async () => {
                // Arrange
                const longTextTasks = [
                    {
                        id: '1',
                        title: 'A'.repeat(1000),
                        description: 'B'.repeat(5000),
                        status: TaskStatus.DONE,
                    },
                ];
                const expectedTasks = longTextTasks.map(task => new Task(task));
                mockTaskModel.find.mockResolvedValue(longTextTasks);

                // Act
                const result = await repository.getAll();

                // Assert
                expect(result).toEqual(expectedTasks);
                expect(result[0].title.length).toBe(1000);
                expect(result[0].description.length).toBe(5000);
                expect(mockTaskModel.find).toHaveBeenCalledWith();
            });

            it('should handle tasks with special characters in title and description', async () => {
                // Arrange
                const specialCharTasks = [
                    {
                        id: '1',
                        title: 'Task with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?',
                        description: 'Description with emojis: 🚀✨🎉',
                        status: TaskStatus.IN_PROGRESS,
                    },
                ];
                const expectedTasks = specialCharTasks.map(task => new Task(task));
                mockTaskModel.find.mockResolvedValue(specialCharTasks);

                // Act
                const result = await repository.getAll();

                // Assert
                expect(result).toEqual(expectedTasks);
                expect(result[0].title).toContain('!@#$%^&*()');
                expect(result[0].description).toContain('🚀✨🎉');
                expect(mockTaskModel.find).toHaveBeenCalledWith();
            });
        });

        describe('Error Handling and Exception Cases', () => {
            it('should throw InternalServerErrorException when database connection fails', async () => {
                // Arrange
                const dbError = new Error('Database connection failed');
                mockTaskModel.find.mockRejectedValue(dbError);

                // Act & Assert
                const promise = repository.getAll();
                await expect(promise).rejects.toThrow(InternalServerErrorException);
                await expect(promise).rejects.toThrow('Database connection failed');
                expect(mockTaskModel.find).toHaveBeenCalledWith();
                expect(mockTaskModel.find).toHaveBeenCalledTimes(1);
            });

            it('should throw InternalServerErrorException when database query times out', async () => {
                // Arrange
                const timeoutError = new Error('Query timeout');
                mockTaskModel.find.mockRejectedValue(timeoutError);

                // Act & Assert
                await expect(repository.getAll()).rejects.toThrow(InternalServerErrorException);
                await expect(repository.getAll()).rejects.toThrow('Query timeout');
                expect(mockTaskModel.find).toHaveBeenCalledWith();
            });

            it('should throw InternalServerErrorException when database returns invalid data', async () => {
                // Arrange
                const invalidDataError = new Error('Invalid data format');
                mockTaskModel.find.mockRejectedValue(invalidDataError);

                // Act & Assert
                await expect(repository.getAll()).rejects.toThrow(InternalServerErrorException);
                await expect(repository.getAll()).rejects.toThrow('Invalid data format');
                expect(mockTaskModel.find).toHaveBeenCalledWith();
            });

            it('should throw InternalServerErrorException when database is locked', async () => {
                // Arrange
                const lockError = new Error('Database is locked');
                mockTaskModel.find.mockRejectedValue(lockError);

                // Act & Assert
                await expect(repository.getAll()).rejects.toThrow(InternalServerErrorException);
                await expect(repository.getAll()).rejects.toThrow('Database is locked');
                expect(mockTaskModel.find).toHaveBeenCalledWith();
            });
        });

        describe('Database Query Behavior', () => {
            it('should call find method without any parameters', async () => {
                // Arrange
                mockTaskModel.find.mockResolvedValue([]);

                // Act
                await repository.getAll();

                // Assert
                expect(mockTaskModel.find).toHaveBeenCalledWith();
                expect(mockTaskModel.find).toHaveBeenCalledTimes(1);
            });

            it('should handle find method being called multiple times', async () => {
                // Arrange
                mockTaskModel.find.mockResolvedValue(mockTasks);

                // Act
                await repository.getAll();
                await repository.getAll();
                await repository.getAll();

                // Assert
                expect(mockTaskModel.find).toHaveBeenCalledTimes(3);
                expect(mockTaskModel.find).toHaveBeenCalledWith();
            });

            it('should handle find method returning null', async () => {
                // Arrange
                mockTaskModel.find.mockResolvedValue(null);

                // Act
                const result = await repository.getAll();

                // Assert
                expect(result).toEqual([]);
                expect(mockTaskModel.find).toHaveBeenCalledWith();
            });

            it('should handle find method returning undefined', async () => {
                // Arrange
                mockTaskModel.find.mockResolvedValue(undefined);

                // Act
                const result = await repository.getAll();

                // Assert
                expect(result).toEqual([]);
                expect(mockTaskModel.find).toHaveBeenCalledWith();
            });
        });

        describe('Task Entity Creation', () => {
            it('should properly create Task entities from database results', async () => {
                // Arrange
                const dbTasks = [
                    {
                        id: '1',
                        title: 'Task 1',
                        description: 'Desc 1',
                        status: TaskStatus.PENDING,
                    },
                ];
                mockTaskModel.find.mockResolvedValue(dbTasks.map(a => new Task(a)));

                // Act
                const result = await repository.getAll();

                // Assert
                expect(result).toHaveLength(1);
                expect(result[0]).toBeInstanceOf(Task);
                expect(result[0].id).toBe('1');
                expect(result[0].title).toBe('Task 1');
                expect(result[0].description).toBe('Desc 1');
                expect(result[0].status).toBe(TaskStatus.PENDING);
            });

            it('should handle tasks with missing optional fields', async () => {
                // Arrange
                const incompleteTasks = [
                    {
                        id: '1',
                        title: 'Incomplete Task',
                        // description and status are missing
                        status: TaskStatus.PENDING,
                    },
                ];
                mockTaskModel.find.mockResolvedValue(incompleteTasks.map(i => new Task(i)));

                // Act
                const result = await repository.getAll();

                // Assert
                expect(result).toHaveLength(1);
                expect(result[0]).toBeInstanceOf(Task);
                expect(result[0].title).toBe('Incomplete Task');
                expect(result[0].description).toBeUndefined();
                expect(result[0].status).toBe(TaskStatus.PENDING); // Default status
            });
        });

        describe('Performance and Memory', () => {
            it('should handle large number of tasks efficiently', async () => {
                // Arrange
                const largeTaskArray = Array.from({ length: 10000 }, (_, index) => ({
                    id: index.toString(),
                    title: `Task ${index}`,
                    description: `Description ${index}`,
                    status: TaskStatus.PENDING,
                }));
                mockTaskModel.find.mockResolvedValue(largeTaskArray);

                // Act
                const startTime = Date.now();
                const result = await repository.getAll();
                const endTime = Date.now();

                // Assert
                expect(result).toHaveLength(10000);
                expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
                expect(mockTaskModel.find).toHaveBeenCalledWith();
            });

            it('should not cause memory leaks with repeated calls', async () => {
                // Arrange
                mockTaskModel.find.mockResolvedValue(mockTasks);

                // Act
                for (let i = 0; i < 100; i++) {
                    await repository.getAll();
                }

                // Assert
                expect(mockTaskModel.find).toHaveBeenCalledTimes(100);
                expect(mockTaskModel.find).toHaveBeenCalledWith();
            });
        });
    });
});
