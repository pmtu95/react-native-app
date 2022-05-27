import React from 'react';
import _ from 'lodash';
import { useForm, Controller } from 'react-hook-form';
import FastImage from 'react-native-fast-image';
import NetInfo from '@react-native-community/netinfo';
import {
    View,
    FlatList,
    Platform,
    Dimensions,
    PermissionsAndroid,
} from 'react-native';
import {
    StyleService,
    useStyleSheet,
    TopNavigation,
    TopNavigationAction,
    ListItem,
    Input,
    Text,
    Toggle,
    Select,
    SelectItem,
    Button,
    ButtonGroup,
    Icon,
    Tab,
    TabView,
    Spinner,
    CheckBox
} from '@ui-kitten/components';
export default function Procms(props) {
    const { details, styles, formData, setFormData, control } = props;
    const [newFormDatas, setNewFormData] = React.useState({
        MS: {
            Presence: 'Y',
            Notice: 'Y',
            Content: 'Y',
            Note: '',
            Checked: false
        },
        OL: {
            Presence: 'Y',
            Notice: 'Y',
            Content: 'Y',
            Note: '',
            Checked: false
        }
    });
    React.useEffect(() => {
        setFormData(newFormDatas);
    }, []);
    return <>

        <View style={[styles.itemContainer, styles.rowItem]}>
            <Text style={styles.infoText}>Chương trình</Text>
            <Text style={styles.valueText}>{details.mechanic}</Text>
        </View>

        <View
            style={[
                styles.itemContainer,
                { flexDirection: 'row', justifyContent: 'space-between' },
            ]}>
            <Text style={styles.infoText}>Vị trí chấm điểm</Text>
            <Text style={styles.valueText}>
                {details.custom_attributes.location || ''}
            </Text>
        </View>
        {Object.keys(newFormDatas).length ? <>
            {Object.keys(newFormDatas).map((_key, index) => {
                return <>
                    <View style={styles.itemContainer}>
                        <View style={styles.rowItem}>
                            <Text style={styles.infoText}>{_key.toUpperCase()}</Text>
                            <Controller
                                control={control}
                                render={({ field: { onChange, value } }) => {
                                    return <>
                                        <CheckBox
                                            checked={value}
                                            onChange={() => {
                                                let newvalue = !value;
                                                let __newFormDatas = { ...newFormDatas };
                                                __newFormDatas[_key].Checked = newvalue;
                                                setNewFormData(__newFormDatas);
                                                setFormData(__newFormDatas);

                                                onChange(newvalue)
                                            }}
                                        >
                                        </CheckBox>
                                    </>
                                }}
                                name={_key + '.Checked'}
                                defaultValue={newFormDatas[_key].Checked}
                            />
                        </View>
                    </View>
                    {newFormDatas[_key].Checked ? <>
                        <View style={styles.itemContainer}>
                            <View style={styles.rowItem}>
                                <Text style={[styles.infoText, { marginBottom: 6 }]}>
                                    Hiện diện sản phẩm
                                </Text>
                                <Controller
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, value } }) => (
                                        <ButtonGroup size="small" status="basic">
                                            <Button
                                                style={
                                                    (value === 'Y') &&
                                                    styles.btnActive
                                                }
                                                onPress={() => {
                                                    onChange('Y');
                                                    let __newFormDatas = { ...newFormDatas };
                                                    __newFormDatas[_key].Presence = 'Y';
                                                    setNewFormData(__newFormDatas);
                                                    setFormData(__newFormDatas);
                                                }}
                                            >
                                                Y
                                            </Button>
                                            <Button
                                                style={
                                                    (value === 'N') &&
                                                    styles.btnActive
                                                }
                                                onPress={() => {
                                                    onChange('N');
                                                    let __newFormDatas = { ...newFormDatas };
                                                    __newFormDatas[_key].Presence = 'N';
                                                    setNewFormData(__newFormDatas);
                                                    setFormData(__newFormDatas);
                                                }}
                                            >
                                                N
                                            </Button>
                                        </ButtonGroup>
                                    )}
                                    name={_key + '.Presence'}
                                    defaultValue={newFormDatas[_key].Presence}
                                />
                            </View>
                        </View>
                        <View style={styles.itemContainer}>
                            <View style={styles.rowItem}>
                                <Text style={[styles.infoText, { marginBottom: 6 }]}>
                                    Có thông báo khuyến mãi
                                </Text>
                                <Controller
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, value } }) => (
                                        <ButtonGroup size="small" status="basic">
                                            <Button
                                                style={
                                                    (value === 'Y') &&
                                                    styles.btnActive
                                                }
                                                onPress={() => {
                                                    onChange('Y');
                                                    let __newFormDatas = { ...newFormDatas };
                                                    __newFormDatas[_key].Notice = 'Y';
                                                    setNewFormData(__newFormDatas);
                                                    setFormData(__newFormDatas);
                                                }}
                                            >
                                                Y
                                            </Button>
                                            <Button
                                                style={
                                                    (value === 'N') &&
                                                    styles.btnActive
                                                }
                                                onPress={() => {
                                                    onChange('N');
                                                    let __newFormDatas = { ...newFormDatas };
                                                    __newFormDatas[_key].Notice = 'N';
                                                    setNewFormData(__newFormDatas);
                                                    setFormData(__newFormDatas);
                                                }}
                                            >
                                                N
                                            </Button>
                                        </ButtonGroup>
                                    )}
                                    name={_key + '.Notice'}
                                    defaultValue={newFormDatas[_key].Notice}
                                />
                            </View>
                        </View>
                        <View style={styles.itemContainer}>
                            <View style={styles.rowItem}>
                                <Text
                                    style={styles.infoText}
                                    numberOfLines={2}
                                    ellipsizeMode="tail">
                                    Sản phẩm đúng nội dung khuyến mãi
                                </Text>
                                <Controller
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, value } }) => (
                                        <ButtonGroup size="small" status="basic">
                                            <Button
                                                style={
                                                    (value === 'Y') &&
                                                    styles.btnActive
                                                }
                                                onPress={() => {
                                                    onChange('Y');
                                                    let __newFormDatas = { ...newFormDatas };
                                                    __newFormDatas[_key].Content = 'Y';
                                                    setNewFormData(__newFormDatas);
                                                    setFormData(__newFormDatas);
                                                }}
                                            >
                                                Y
                                            </Button>
                                            <Button
                                                style={
                                                    (value === 'N') &&
                                                    styles.btnActive
                                                }
                                                onPress={() => {
                                                    onChange('N');
                                                    let __newFormDatas = { ...newFormDatas };
                                                    __newFormDatas[_key].Content = 'N';
                                                    setNewFormData(__newFormDatas);
                                                    setFormData(__newFormDatas);
                                                }}
                                            >
                                                N
                                            </Button>
                                        </ButtonGroup>
                                    )}
                                    name={_key + '.Content'}
                                    defaultValue={newFormDatas[_key].Content}
                                />
                            </View>
                        </View>
                        <View style={styles.itemContainer}>
                            <Text style={[styles.infoText, { marginBottom: 6 }]}>
                                Ghi chú
                            </Text>
                            <Controller
                                control={control}
                                rules={{ required: false }}
                                render={({
                                    field: { onChange, value },
                                }) => (
                                    <>
                                        <Input
                                            value={value}
                                            onChangeText={(newvalue) => {
                                                onChange(newvalue);
                                                let __newFormDatas = { ...newFormDatas };
                                                __newFormDatas[_key].Note = newvalue;
                                                setNewFormData(__newFormDatas);
                                                setFormData(__newFormDatas);
                                            }}
                                            multiline
                                            numberOfLines={5}
                                            textAlignVertical="top"
                                            textStyle={{ minHeight: 100 }}
                                        />
                                    </>
                                )}
                                name={_key + '.Note'}
                                defaultValue={newFormDatas[_key].Note}
                            />
                        </View>

                    </> : null}
                </>
            })}
        </> : null}

    </>;
}