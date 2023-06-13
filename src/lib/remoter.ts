const SMB2 = require('@marsaud/smb2');
import * as fs from 'fs';
import { Writable } from 'stream';

interface LpRemoterOpt {
    /**
     * 远程win机器的Ip
     */
    ip: string;
    /**
     * 远程共享文件夹名称
     */
    dirName: string;
    /**
     * 远程电脑账号【共享文件夹时 指定的账号】
     */
    username: string;
    /**
     * 远程电脑密码【共享文件夹时 指定的账号 对应的密码】
     */
    password: string;
}

interface ICreateWriteStreamOptions {
    autoClose?: boolean;
    fd?: number;
    flags?: string;
    start?: number;
}

interface ICreateReadStreamOptions {
    autoClose?: boolean;
    end?: number;
    fd?: number;
    flags?: string;
    start?: number;
}

const DEFAULT_WRITESTREAM_CONFIG = { autoClose: true, flags: 'w+' };

export default class LpRemoteShare {
    /**
     * 远程实例对象
     */
    private remoter;
    private shareConfig = {};
    /**
     * 默认 createWriteStream 的配置
     */
    private streamOpt: ICreateWriteStreamOptions = DEFAULT_WRITESTREAM_CONFIG;

    constructor(opt: LpRemoterOpt) {
        this.shareConfig = {
            share: `\\\\${opt.ip}\\${opt.dirName}`,
            domain: 'DOMAIN',
            username: opt.username,
            password: opt.password,
        };
        this.remoter = new SMB2(this.shareConfig);
    }

    /**
     * 传输文件到 目标机器
     * eg:transformLocalFileToRemote(path.join(__dirname, './aaa.txt'), 'a.txt')
     * @param sourceFile 目标文件
     * @param targetFile 源文件
     * @param opt
     * @returns
     */
    public async transformLocalFileToRemote(sourceFile: string, targetFile: string, opt?: ICreateWriteStreamOptions) {
        return new Promise((resolve, reject) => {
            this.remoter.createWriteStream(
                targetFile.replace(/\//g, '\\'),
                opt || this.streamOpt,
                function (err, writeStream) {
                    if (err) reject(err);
                    resolve(fs.createReadStream(sourceFile).pipe(writeStream));
                },
            );
        });
    }

    public createWriteStream(targetFile: string, opt?: ICreateWriteStreamOptions): Promise<Writable> {
        return new Promise((resolve, reject) => {
            this.remoter.createWriteStream(
                targetFile.replace(/\//g, '\\'),
                opt || this.streamOpt,
                function (_, writeStream) {
                    if (_) reject(_);
                    resolve(writeStream);
                },
            );
        });
    }

    /**
     * 获取 共享文件 到本地
     * eg:  transformRemoteFileToLocal('a/v/c.js', './a.js')
     * @param targetFilePath 目标文件
     * @param localFilePath 源文件
     * @returns
     */
    public async transformRemoteFileToLocal(
        targetFilePath: string,
        localFilePath: string,
        opt?: ICreateReadStreamOptions,
    ): Promise<Error | Buffer> {
        return new Promise((resolve, reject) => {
            this.remoter.createReadStream(
                targetFilePath.replace(/\//g, '\\'),
                opt || this.streamOpt,
                function (err, readStream) {
                    if (err) reject(err);
                    resolve(readStream.pipe(fs.createWriteStream(localFilePath)));
                },
            );
        });
    }

    /**
     * 获取 共享文件夹 下的文件
     * eg:
     * await readFile('/a/b.txt')
     *
     * @param targetFilePath 目标路径
     * @returns Promise<Error | Buffer>
     */
    public async readFile(targetFilePath: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            this.remoter.readFile(targetFilePath.replace(/\//g, '\\'), (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }

    /**
     * 写文件到远程
     * eg:
     * await writeFile('/a/b.txt', buffer)
     *
     * @param targetFilePath 目标路径
     * @param data 写入的数据
     * @returns Promise<Error | boolean>
     */
    public async writeFile(targetFilePath: string, data: Buffer): Promise<Error | boolean> {
        return new Promise((resolve, reject) => {
            this.remoter.writeFile(targetFilePath.replace(/\//g, '\\'), data, (err, data) => {
                if (err) reject(err);
                resolve(true);
            });
        });
    }

    /**
     * 测试连接信息
     * @returns
     */
    public async testConnection(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.remoter.exists('a.txt', (err, exists) => {
                console.log(JSON.stringify(this.shareConfig), err);

                if (err?.code == 'STATUS_LOGON_FAILURE') reject('密码错误，请检查密码!');
                if (err?.code == 'STATUS_BAD_NETWORK_NAME') reject('共享文件夹名错误，请检查共享文件夹名称!');
                if (err?.code == 'ENOTFOUND') reject('找不到此IP, 请检查IP!');
                if (err?.code == 'STATUS_ACCESS_DENIED')
                    reject('用户名不正确，请检查共享文件夹的共享用户名是否和填写一致!');

                if (err) reject(err);
                resolve(exists);
            });
        });
    }

    private async mkSampleDir(targetFilePath: string): Promise<true> {
        return new Promise((rs, rj) => {
            this.remoter.mkdir(targetFilePath.replace(/\//g, '\\'), function (err) {
                if (err) rj(err);
                rs(true);
            });
        });
    }

    public async mkdir(targetFilePath: string) {
        try {
            const floderList = targetFilePath.split('/');
            console.log(floderList, '--');
            for (let i = 0; i < floderList.length; i++) {
                const curPath = floderList.slice(0, i + 1).join('/');
                if (!(await this.exists(floderList.slice(0, i + 1).join('/')))) {
                    await this.mkSampleDir(curPath);
                }
            }
            return true;
        } catch (error) {
            throw error;
        }
    }

    /**
     * 判断文件/文件夹是否存在
     * @param targetFilePath
     * @returns
     */
    public async exists(targetFilePath: string): Promise<boolean> {
        return new Promise((rs, rj) => {
            this.remoter.exists(targetFilePath.replace(/\//g, '\\'), function (err, exists) {
                if (err) rj(err);
                rs(exists);
            });
        });
    }
}
