import React from 'react';
import styles from './styles.module.css';
import MessageForm from '@/components/MessageForm';
import MessagesList from '@/components/MessagesList';
import apiService from '@/apiService';
import ChatForm from '@/components/ChatForm';
import ChatList from '@/components/ChatList';
import Typography from '@material-ui/core/Typography';
import {
    Box,
    //Button,
    Card,
    //CardActions,
    CardContent,
    Dialog,
    DialogContent,
    DialogTitle
} from '@material-ui/core';
//import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { AddBox } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from '@/styling/theme';

export default class ProfileView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chats: [],
            isDialogOpen: false
        };
    }

    componentDidMount() {
        this.getChatList();
    }

    handleChatCreate(params) {
        apiService.chat.create(params).then(() => this.getChatList());
        this.setState({ isDialogOpen: false });
    }

    getChatList() {
        apiService.chat
            .getMyChats(this.props.user.id)
            .then(response => response.data)
            .then(chats => this.setState({ chats }));
    }

    goHandler(id) {
        this.props.history.push(`/chat/${id}`);
    }

    joinHandler(id) {
        if (!confirm('Вы действительно хотите вступить в этот чат?')) return;

        apiService.chat.join(id).then(() => this.getChatList());
    }

    deleteHandler(id) {
        if (!confirm('Вы действительно хотите удалить этот чат?')) return;

        apiService.chat.delete(id).then(() => this.getChatList());
    }

    render() {
        const { user } = this.props;
        const { isDialogOpen } = this.state;

        return (
            <ThemeProvider theme={theme}>
                <div className={styles.root}>
                    <Grid
                        container
                        direction="column"
                        justify="space-between"
                        alignItems="flex-start"
                    >
                        <Grid item xs={12} sm={6}>
                            <Card className={styles.User}>
                                <CardContent>
                                    <Typography variant="h5" component="h2">
                                        Юзер {user.nickname}
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                        С нами с {new Date(user.createdAt).toLocaleString()}
                                    </Typography>
                                </CardContent>
                                <div className={styles.add}>
                                    <IconButton
                                        onClick={() => this.setState({ isDialogOpen: true })}
                                    >
                                        <AddBox />
                                    </IconButton>
                                </div>
                                {/*<CardActions className={styles.edit}>*/}
                                {/*    <Button size="small">Редактировать</Button>*/}
                                {/*</CardActions>*/}
                            </Card>
                        </Grid>
                    </Grid>
                    <div className={styles.chatList}>
                        <Box marginTop={3} marginX="auto">
                            <Grid>
                                <ChatList
                                    className={styles.chat}
                                    userId={user.id}
                                    list={this.state.chats}
                                    goHandler={id => this.goHandler(id)}
                                    joinHandler={id => this.joinHandler(id)}
                                    deleteHandler={id => this.deleteHandler(id)}
                                    //onClick={(styles.chatView.opacity = 1)}
                                />
                            </Grid>
                        </Box>
                    </div>
                    <Dialog
                        onClose={() => this.setState({ isDialogOpen: false })}
                        aria-labelledby="simple-dialog-title"
                        open={isDialogOpen}
                    >
                        <DialogTitle>Хотите создать чат?</DialogTitle>
                        <DialogContent dividers="false">
                            <Typography variant="body1" component="p">
                                Введите название
                            </Typography>
                            <ChatForm handleSubmit={data => this.handleChatCreate(data)} />
                        </DialogContent>
                    </Dialog>
                </div>
            </ThemeProvider>
        );
    }
}

export class ChatView extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            users: []
        };
        this.timer = null;
    }

    componentDidMount() {
        let firstTime = true;
        this.setState({ users: [], messages: [] });
        this.timer = setInterval(async () => {
            await this.getMessages();
            if (firstTime) {
                this.scrollToBottom();
            }
            firstTime = false;
        }, 500);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    postMessage({ content }) {
        apiService.message
            .create({ content, chatId: this.props.match.params.id })
            .then(async () => {
                await this.getMessages();
                this.scrollToBottom();
            });
    }

    scrollToBottom() {
        this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
    }

    async getMessages() {
        function getMessageIds(messages) {
            return messages.map(message => message.id);
        }

        function getOnlyNewMessages(serverMessages, stateMessages) {
            const serverIds = getMessageIds(serverMessages);
            const stateIds = getMessageIds(stateMessages);
            const newIds = serverIds.filter(id => !stateIds.includes(id));
            return serverMessages.filter(message => newIds.includes(message.id));
        }

        const response = await apiService.message.getMessages(this.props.match.params.id);
        const serverMessages = response.data;
        let newMessages = getOnlyNewMessages(serverMessages, this.state.messages);
        await this.getUsers(newMessages);
        newMessages = newMessages.map(message => {
            const user = this.state.users.find(user => user.id === message.userId);
            message.nickname = user.nickname;
            return message;
        });
        this.setState({ messages: [...this.state.messages, ...newMessages] });
    }

    async getUsers(newMessages) {
        const oldUsers = this.state.users;
        const oldUsersIds = oldUsers.map(user => user.id);
        const newUsersIds = [...new Set(newMessages.map(message => message.userId))];
        const toLoad = newUsersIds.filter(id => !oldUsersIds.includes(id));

        if (!toLoad.length) return;

        const newUsers = [];
        for (let id of toLoad) {
            const user = await apiService.user.getById(id);
            newUsers.push(user);
        }
        this.setState({ users: [...oldUsers, ...newUsers] });
    }

    render() {
        const { messages } = this.state;
        return (
            <div className={styles.chatView}>
                <div className={styles.messages}>
                    <MessagesList messages={messages} />
                    <div
                        style={{ float: 'left', clear: 'both' }}
                        ref={el => {
                            this.messagesEnd = el;
                        }}
                    />
                </div>
                <div className={styles.form}>
                    <MessageForm postMessage={data => this.postMessage(data)} />
                </div>
            </div>
        );
    }
}
